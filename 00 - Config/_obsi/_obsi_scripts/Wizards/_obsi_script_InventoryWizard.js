// Inventory wizard — prompts name + item_type (which drives icon/iconColor),
// an optional gold value, and an optional owner picked from the party's PCs.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}".
module.exports = async (params) => {
    const { app, quickAddApi, variables } = params;
    const path = require("path");
    const iconRegistry = require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
    ));

    const SKIP = "— Skip —";

    const name = await quickAddApi.inputPrompt("Item name?");
    if (!name) { variables.cancelled = true; return; }

    const types = iconRegistry("inventory");
    const labels = Object.keys(types);
    const item_type = await quickAddApi.suggester(labels, labels, "Item type?");
    if (!item_type) { variables.cancelled = true; return; }

    const style = types[item_type];

    const gold = await quickAddApi.inputPrompt("Gold value? (blank if unknown)");

    variables.name = name;
    variables.fileName = name;
    variables.item_type = item_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.gold_value = gold ? String(gold).trim() : "";
    variables.owner = "";

    const campaignRoot = variables.folderName;
    if (!campaignRoot) return;

    const pcs = app.vault.getMarkdownFiles()
        .filter(f => {
            if (!f.path.startsWith(campaignRoot + "/")) return false;
            const t = String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
            return t === "player";
        })
        .sort((a, b) => a.basename.localeCompare(b.basename));
    if (!pcs.length) return;

    const picked = await quickAddApi.suggester(
        [SKIP, ...pcs.map(f => f.basename)],
        [SKIP, ...pcs],
        "Who carries it?"
    );
    if (!picked || picked === SKIP) return;

    variables.owner = `"[[${picked.basename}]]"`;
};
