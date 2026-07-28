// Faction wizard — prompts name + faction_type, then an optional parent faction
// picked from the factions already in this campaign.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". This script then
// overwrites folderName with the full destination folder, so the macro's
// template step writes to {{VALUE:folderName}} alone:
//   without a parent -> {campaign}/World/Factions/{name}.md
//   with a parent    -> {campaign}/World/Factions/sub-factions/{parent}/{name}.md
module.exports = async (params) => {
    const { app, quickAddApi, variables } = params;
    const path = require("path");
    const iconRegistry = require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
    ));

    const name = await quickAddApi.inputPrompt("Faction name?");
    if (!name) { variables.cancelled = true; return; }

    const types = iconRegistry("faction");
    const labels = Object.keys(types);
    const faction_type = await quickAddApi.suggester(labels, labels, "Faction type?");
    if (!faction_type) { variables.cancelled = true; return; }

    const style = types[faction_type];

    variables.name = name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.leader = "";
    variables.locations = "";
    variables.goal = "";
    variables.description = "";
    variables.word_description = "";
    variables.emblem_description = "";
    variables.fileName = name;
    variables.faction_type = faction_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.parent_faction = "";

    const campaignRoot = variables.folderName;
    if (!campaignRoot) return;

    const factionsRoot = `${campaignRoot}/World/Factions`;
    variables.folderName = factionsRoot;

    const factions = app.vault.getMarkdownFiles()
        .filter(f => {
            if (!f.path.startsWith(campaignRoot + "/")) return false;
            if (f.basename === name) return false;
            const t = String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
            return t === "faction";
        })
        .sort((a, b) => a.basename.localeCompare(b.basename));
    if (!factions.length) return;

    const hasParent = await quickAddApi.yesNoPrompt(
        "Does this faction have a parent faction?",
        "Yes opens a picker of all factions in this campaign."
    );
    if (!hasParent) return;

    const picked = await quickAddApi.suggester(
        factions.map(f => f.basename), factions, "Parent faction?"
    );
    if (!picked) return;

    variables.parent_faction = `\n  - "[[${picked.basename}]]"`;
    variables.folderName = `${factionsRoot}/sub-factions/${picked.basename}`;
};
