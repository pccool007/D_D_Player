// Shared plumbing for the "Macro - Add …" wizards, which are all the same shape:
// build a field list, ask it in ONE _obsi_script_FormPrompt modal, map the answers
// onto QuickAdd variables. Everything the eight wizards used to re-implement by
// hand lives here — the campaign-scoped note lookup, the two picker field shapes,
// the two YAML link shapes, and the campaign world every `locations` list leads with.
//
// Usage (QuickAdd wizard scripts — require by absolute path):
//   const wizardForm = require(path.join(
//       app.vault.adapter.basePath,
//       "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_WizardForm.js"
//   ))(params);
//
// Templater also auto-registers it as tp.user._obsi_script_WizardForm(params).
//
// NOTE: Node's require() cache means edits here need an Obsidian reload to reach
// QuickAdd.

const SKIP = "— Skip —";

module.exports = (params) => {
    const app = params?.app || window.app;
    const path = require("path");
    const helper = (file) => require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/" + file
    ));
    const iconRegistry = helper("_obsi_script_IconRegistry.js");
    const formPrompt = helper("_obsi_script_FormPrompt.js");
    const bareWorldName = helper("_obsi_script_GetWorldName.js").bareWorldName;

    // `type` is not consistently cased across the templates (capitalised for
    // Location/NPC/…, lowercase for campaign/session), so every comparison is
    // lowercased — the same rule the Dataview queries follow.
    const typeOf = (file) =>
        String(app.metadataCache.getFileCache(file)?.frontmatter?.type || "").toLowerCase();

    // The campaign whose folder this note belongs in, or null.
    //
    // _obsi_script_SetParamsInCapGetCampaignFolder takes path segment [1] of the
    // active note without checking it, so clicking a button from Dashboard.md or
    // README.md yields the truthy string "01 - Campaigns/undefined" and quietly
    // misfiles the note. Verify the folder exists so the wizard can say so instead.
    const campaignRoot = (candidate) => {
        const root = candidate ?? params?.variables?.folderName ?? "";
        if (!root || !root.startsWith("01 - Campaigns/")) return null;
        return app.vault.getAbstractFileByPath(root) ? root : null;
    };

    // Campaign-scoped, type-filtered, alphabetical. `types` is a list of lowercase
    // frontmatter `type` values; `exclude` a basename to leave out (a note may not
    // be its own parent).
    const notesOf = (root, types, { exclude } = {}) => {
        if (!root) return [];
        const wanted = types.map(t => t.toLowerCase());
        return app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith(root + "/"))
            .filter(f => f.basename !== exclude)
            .filter(f => wanted.includes(typeOf(f)))
            .sort((a, b) => a.basename.localeCompare(b.basename));
    };

    // The campaign's world, as the bare name every child note stores — read from the
    // manager note's frontmatter rather than Dataview, which the wizards would race.
    // Templater's tp.user._obsi_script_GetWorldName does the same lookup from a path;
    // this is the same thing from a campaign root, sharing its unwrapping.
    const worldName = (root) => {
        const campaign = String(root ?? "").split("/")[1];
        if (!campaign) return "";
        const manager = app.vault.getAbstractFileByPath(`${root}/${campaign}.md`);
        return bareWorldName(
            manager && app.metadataCache.getFileCache(manager)?.frontmatter?.world
        );
    };

    // Everything in a campaign sits inside its world, so every `locations` list leads
    // with it — an NPC met nowhere in particular still belongs somewhere, and shows up
    // on the world's page. Deduplicated, so picking the world explicitly is harmless.
    //
    // NOT for a location's own `locations`: that field is its hierarchy parent and
    // decides its folder.
    const withWorld = (root, names) => {
        const list = [].concat(names ?? []).filter(Boolean).map(String);
        const world = worldName(root);
        if (!world || list.includes(world)) return list;
        // Only link a world that really is a Location note in this campaign. A manager
        // note whose world was renamed, or never created, must not seed a broken link
        // into every note made afterwards.
        const exists = notesOf(root, ["location"]).some(f => f.basename === world);
        return exists ? [world, ...list] : list;
    };

    // A dropdown of existing notes, "— Skip —" first. With nothing to offer it
    // becomes a disabled row carrying `emptyHint`, so the field stays visible and
    // explains itself rather than silently vanishing from the form.
    const noteField = ({ key, label, files, description, emptyHint, value }) => files.length
        ? {
            key, label, description, type: "select", value: value ?? "",
            options: [[SKIP, ""], ...files.map(f => [f.basename, f.basename])],
        }
        : { key, label, type: "select", options: [], disabled: true, description: emptyHint };

    // Same, but several notes at once — a button that opens the filterable picker.
    // The note's path rides along as each row's subtitle, which is how you tell two
    // same-named notes apart in the list.
    const noteMultiField = ({ key, label, files, description, emptyHint, placeholder }) => files.length
        ? {
            key, label, description, type: "multi",
            placeholder: placeholder ?? `Choose ${label.toLowerCase()}…`,
            pickerTitle: `${label} — pick as many as apply`,
            options: files.map(f => [f.basename, f.basename, f.path]),
        }
        : { key, label, type: "multi", options: [], disabled: true, description: emptyHint };

    // The icon registry is an ordered array for `location` and an object keyed by
    // label everywhere else — normalise both to [{label, …style}] so callers never
    // branch on the domain.
    const typesIn = (domain) => {
        const table = iconRegistry(domain);
        return Array.isArray(table)
            ? table
            : Object.entries(table).map(([label, style]) => ({ label, ...style }));
    };

    // A dropdown of an IconRegistry domain's labels. Registry key order drives the
    // option order, so it matches the suggesters these forms replaced.
    const typeField = ({ key, label, domain, description, value }) => {
        const labels = typesIn(domain).map(t => t.label);
        return {
            key, label, description, type: "select",
            value: labels.includes(value) ? value : labels[0],
            options: labels.map(l => [l, l]),
        };
    };

    const styleFor = (domain, label) =>
        typesIn(domain).find(t => t.label === label) || {};

    // Free text bound for a slot the template already wraps in quotes ("{{VALUE:x}}").
    // A typed " would close that quote and break the whole frontmatter block, so it
    // becomes ' — the same swap _obsi_script_ParseCapture.js makes.
    const plain = (value) => String(value ?? "").replace(/"/g, "'");

    // The two YAML shapes the templates expect: a scalar slot the template leaves
    // unquoted, and a list slot. Both return "" for an empty value so the property
    // parses as null rather than as the string "[[]]".
    const link = (name) => (name ? `"[[${name}]]"` : "");
    const yamlList = (names) => []
        .concat(names ?? [])
        .filter(Boolean)
        .map(n => `\n  - "[[${n}]]"`)
        .join("");

    return {
        SKIP,
        app,
        formPrompt,
        iconRegistry,
        typeOf,
        campaignRoot,
        notesOf,
        worldName,
        withWorld,
        noteField,
        noteMultiField,
        typesIn,
        typeField,
        styleFor,
        plain,
        link,
        yamlList,
    };
};
