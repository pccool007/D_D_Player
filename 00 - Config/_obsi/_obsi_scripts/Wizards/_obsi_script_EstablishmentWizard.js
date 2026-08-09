// Establishment wizard — one form: name, category, the location it sits in, and
// the NPC who owns it.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}" — this script then OVERWRITES
// folderName with the final destination, since establishments live inside the folder
// of the location they sit in:
//   parent chosen  -> {parent location folder}/Establishments
//   no parent      -> {campaign}/World/Establishments
//
// Replaces the inline <%* %> suggester that used to live in
// Template_Establishment.md (which also had a latent bug: its fallback branch
// emitted `establishment_type: undefined`).
module.exports = async (params) => {
    const { variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const Notice = params?.obsidian?.Notice;
    const path = require("path");
    const form = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_WizardForm.js"
    ))(params);
    const { app } = form;

    const campaignRoot = form.campaignRoot();
    if (!campaignRoot) {
        if (Notice) new Notice("Cannot resolve the campaign folder — open a note inside a campaign first.");
        cancel();
    }

    const locations = form.notesOf(campaignRoot, ["location"]);
    const owners = form.notesOf(campaignRoot, ["npc"]);
    const byName = new Map(locations.map(f => [f.basename, f]));

    // Usually the location note whose button was clicked.
    const active = app.workspace.getActiveFile?.();
    const activeIsLocation = active
        && form.typeOf(active) === "location"
        && byName.has(active.basename);

    const answers = await form.formPrompt({
        title: "New establishment",
        saveLabel: "Create establishment",
        fields: [
            { key: "name", label: "Establishment name", required: true, placeholder: "The Gilded Flagon" },
            form.typeField({ key: "establishment_type", label: "Category", domain: "establishment" }),
            form.noteField({
                key: "locations",
                label: "Parent location",
                files: locations,
                value: activeIsLocation ? active.basename : "",
                description: activeIsLocation
                    ? "Defaults to the note you are in. Files the establishment inside its folder."
                    : "Files the establishment inside that location's folder.",
                emptyHint: "No location in this campaign yet.",
            }),
            form.noteField({
                key: "owner",
                label: "Owner",
                files: owners,
                description: "The NPC who runs it.",
                emptyHint: "No NPC in this campaign yet.",
            }),
        ],
    });
    if (!answers) cancel();

    const parent = byName.get(answers.locations) || null;

    variables.name = answers.name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.description = "";
    variables.word_description = "";
    variables.fileName = answers.name;
    variables.establishment_type = answers.establishment_type;
    // Scalar slot, unquoted in the template — it arrives already quoted.
    variables.owner = form.link(answers.owner);
    variables.icon = form.styleFor("establishment", answers.establishment_type).icon;
    // One answered parent, plus the campaign world. Only the parent decides the folder
    // below, so the extra entry cannot move the note.
    variables.locations = form.yamlList(form.withWorld(campaignRoot, parent ? parent.basename : null));

    // Locations are folder notes ({Name}/{Name}.md), so the parent's folder is where
    // its Establishments/ subfolder belongs. A location that is NOT a folder note is a
    // pre-migration leftover — link it, but file the establishment in the shared folder
    // rather than polluting a tier folder.
    const unparented = `${campaignRoot}/World/Establishments`;
    const isFolderNote = parent && parent.parent?.name === parent.basename;
    variables.folderName = isFolderNote
        ? `${parent.parent.path}/Establishments`
        : unparented;
};
