// PC wizard — prompts character name + class (which drives icon/iconColor),
// the real person playing them, and the character's race.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}".
//
// `race` is free text here rather than a suggester: player races are an open set
// (and expand with every supplement), unlike the fixed 5e creature types NPCs use.
module.exports = async (params) => {
    const { quickAddApi, variables } = params;
    const path = require("path");
    const iconRegistry = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
    ));

    const name = await quickAddApi.inputPrompt("Character name?");
    if (!name) { variables.cancelled = true; return; }

    const classes = iconRegistry("pc");
    const labels = Object.keys(classes);
    const pcClass = await quickAddApi.suggester(labels, labels, "Class?");
    if (!pcClass) { variables.cancelled = true; return; }

    const style = classes[pcClass];

    const player = await quickAddApi.inputPrompt("Who plays them? (real name)");
    const race = await quickAddApi.inputPrompt("Race? (blank to fill in later)");

    variables.name = name;
    variables.fileName = name;
    variables.class = pcClass === "Other" ? "" : pcClass;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.player = player ? String(player).trim() : "";
    variables.race = race ? String(race).trim() : "";
};
