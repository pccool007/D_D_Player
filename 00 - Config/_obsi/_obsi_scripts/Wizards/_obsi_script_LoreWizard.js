// Lore wizard — prompts name + lore_type (which drives icon/iconColor). For
// Player_Lore it additionally offers a related-lore picker, since player-facing
// lore is usually a retelling of something already recorded.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}".
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

    const name = await quickAddApi.inputPrompt("Lore name?");
    if (!name) cancel();

    const types = iconRegistry("lore");
    const labels = Object.keys(types);
    const lore_type = await quickAddApi.suggester(labels, labels, "Lore type?");
    if (!lore_type) cancel();

    const style = types[lore_type];

    variables.name = name;
    variables.fileName = name;
    variables.lore_type = lore_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.relations = "";

    if (lore_type !== "Player_Lore") return;

    const campaignRoot = variables.folderName;
    if (!campaignRoot) return;

    const lores = app.vault.getMarkdownFiles()
        .filter(f => {
            if (!f.path.startsWith(campaignRoot + "/")) return false;
            if (f.basename === name) return false;
            const t = String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
            return t === "lore";
        })
        .sort((a, b) => a.basename.localeCompare(b.basename));
    if (!lores.length) return;

    const picked = await quickAddApi.suggester(
        [SKIP, ...lores.map(f => f.basename)],
        [SKIP, ...lores],
        "Related lore?"
    );
    if (!picked || picked === SKIP) return;

    variables.relations = `\n  - "[[${picked.basename}]]"`;
};
