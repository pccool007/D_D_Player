// Establishment wizard — prompts name + category, then an optional parent location.
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
    const { app, quickAddApi, variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const path = require("path");
    const iconRegistry = require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
    ));

    const SKIP = "— Skip —";

    const name = await quickAddApi.inputPrompt("Establishment name?");
    if (!name) cancel();

    const categories = iconRegistry("establishment");
    const labels = Object.keys(categories);
    const establishment_type = await quickAddApi.suggester(
        labels, labels, "Establishment category?"
    );
    if (!establishment_type) cancel();

    variables.name = name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.owner = "";
    variables.description = "";
    variables.word_description = "";
    variables.fileName = name;
    variables.establishment_type = establishment_type;
    variables.icon = categories[establishment_type].icon;
    variables.locations = "";

    // Optional parent location — usually the location note whose button was clicked.
    const campaignRoot = variables.folderName;
    const unparented = campaignRoot
        ? `${campaignRoot}/World/Establishments`
        : "";
    variables.folderName = unparented;
    if (!campaignRoot) return;

    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();

    // Locations are folder notes ({Name}/{Name}.md), so the parent's folder is where
    // its Establishments/ subfolder belongs. A location that is NOT a folder note is a
    // pre-migration leftover — link it, but file the establishment in the shared folder
    // rather than polluting a tier folder.
    const nestUnder = (locationFile) => {
        variables.locations = `\n  - "[[${locationFile.basename}]]"`;
        const isFolderNote = locationFile.parent?.name === locationFile.basename;
        variables.folderName = isFolderNote
            ? `${locationFile.parent.path}/Establishments`
            : unparented;
    };

    const active = app.workspace.getActiveFile?.();
    if (active && typeOf(active) === "location") {
        const link = await quickAddApi.yesNoPrompt(
            `Set parent location to [[${active.basename}]]?`,
            "Yes files the establishment inside this location's folder. No opens a picker."
        );
        if (link) {
            nestUnder(active);
            return;
        }
    }

    const locations = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(campaignRoot + "/") && typeOf(f) === "location")
        .sort((a, b) => a.basename.localeCompare(b.basename));
    if (!locations.length) return;

    const picked = await quickAddApi.suggester(
        [SKIP, ...locations.map(f => f.basename)],
        [SKIP, ...locations],
        "Parent location?"
    );
    if (!picked || picked === SKIP) return;

    nestUnder(picked);
};
