// At-the-table capture wizard — one script behind all four quick-capture note
// templates in "00 - Config/Notes Templates":
//
//   Note_New_NPC.md            -> tp.user._obsi_script_CaptureWizard(tp, "npc")
//   Note_New_Faction.md        -> ... "faction"
//   Note_New_Location.md       -> ... "location"
//   Note_New_Establishment.md  -> ... "establishment"
//
// It returns the capture block (see _obsi_script_CaptureSpecs.js for the format),
// or "" when cancelled.
//
// ONE form, not a prompt chain: every field lands in a single _obsi_script_FormPrompt
// modal — free text where text is the point, and a real dropdown everywhere a value
// is a closed set. Types come from IconRegistry (the same lists the "Macro - Add …"
// wizards offer) and people/places come from the notes that already exist in this
// campaign, so a captured value promotes without being retyped. Fields that take
// several notes (an NPC's factions, a faction's locations) are inline checkbox
// lists, so the capture never spills into a second modal.
//
// Only the name is required. Leave anything else empty and the line keeps its
// {hint} — a half-filled capture is fine, you are writing mid-session.
const SKIP = "— leave empty —";

module.exports = async (tp, domain) => {
    const app = tp?.app || window.app;
    const specs = tp.user._obsi_script_CaptureSpecs();

    let spec;
    try {
        spec = specs.get(domain);
    } catch (e) {
        const message = String(e.message || e);
        try { new Notice(message); } catch (_) { console.log("[CaptureWizard]", message); }
        return "";
    }

    const active = app.workspace.getActiveFile();
    const campaignRoot = active?.path.startsWith("01 - Campaigns/")
        ? active.path.split("/").slice(0, 2).join("/")
        : null;

    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
    const notesOf = (types) => app.vault.getMarkdownFiles()
        .filter(f => !campaignRoot || f.path.startsWith(campaignRoot + "/"))
        .filter(f => types.includes(typeOf(f)))
        .sort((a, b) => a.basename.localeCompare(b.basename));

    const iconLabels = (iconDomain) => {
        const table = tp.user._obsi_script_IconRegistry(iconDomain);
        return Array.isArray(table) ? table.map(t => t.label) : Object.keys(table);
    };

    const skippable = (labels) => [[SKIP, ""], ...labels.map(l => [l, l])];

    const formFields = [{
        key: "name",
        label: `${spec.type} name`,
        required: true,
        placeholder: "Required",
    }];

    for (const field of spec.fields) {
        if (field.input === "hint") continue;

        if (field.input === "noteMulti") {
            const files = notesOf(field.noteTypes);
            // Nothing to link to yet → fall back to text so the value is not lost.
            formFields.push(files.length
                ? { key: field.key, label: field.label, type: "multi",
                    placeholder: `Choose ${field.label.toLowerCase()}…`,
                    pickerTitle: `${field.label} — pick as many as apply`,
                    options: files.map(f => [f.basename, f.basename, f.path]) }
                : { key: field.key, label: field.label, placeholder: field.hint });
            continue;
        }

        if (field.input === "noteSelect") {
            const files = notesOf(field.noteTypes);
            // Nothing to link to yet → fall back to text so the value is not lost.
            formFields.push(files.length
                ? { key: field.key, label: field.label, type: "select",
                    options: skippable(files.map(f => f.basename)), value: "" }
                : { key: field.key, label: field.label, placeholder: field.hint });
            continue;
        }

        if (field.input === "iconType" || field.input === "select") {
            let labels;
            try {
                labels = field.input === "iconType" ? iconLabels(field.iconDomain) : field.options;
            } catch (e) {
                console.error("[CaptureWizard] option list failed", e);
                labels = null;
            }
            formFields.push(labels
                ? { key: field.key, label: field.label, type: "select",
                    options: skippable(labels), value: "" }
                : { key: field.key, label: field.label, placeholder: field.hint });
            continue;
        }

        formFields.push({ key: field.key, label: field.label, placeholder: field.hint });
    }

    const answers = await tp.user._obsi_script_FormPrompt({
        title: `New ${spec.type} — quick capture`,
        fields: formFields,
        saveLabel: "Insert",
    });
    if (!answers || !answers.name) return "";

    return specs.render(spec, answers.name, answers);
};
