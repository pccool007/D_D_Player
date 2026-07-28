// Quest wizard — prompts name + reward, then campaign-filtered pickers for the
// quest's Owner (NPC or Faction) and its Location.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}".
//
// quest_status is not prompted: a brand-new quest is always "To Do". The icon
// still comes from IconRegistry so quest styling lives in one place.
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
    const INITIAL_STATUS = "To Do";

    const name = await quickAddApi.inputPrompt("Quest name?");
    if (!name) cancel();

    const reward = await quickAddApi.inputPrompt("Reward? (gold, item, favor…)");

    const style = iconRegistry("quest")[INITIAL_STATUS];

    variables.name = name;
    variables.fileName = name;
    variables.reward = reward ? String(reward).trim() : "";
    variables.quest_status = INITIAL_STATUS;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.owner = "";
    variables.locations = "";

    const campaignRoot = variables.folderName;
    if (!campaignRoot) return;

    const pickOne = async (question, typeSet) => {
        const files = app.vault.getMarkdownFiles()
            .filter(f => {
                if (!f.path.startsWith(campaignRoot + "/")) return false;
                const t = String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
                return typeSet.has(t);
            })
            .sort((a, b) => a.basename.localeCompare(b.basename));
        if (!files.length) return "";
        const picked = await quickAddApi.suggester(
            [SKIP, ...files.map(f => f.basename)],
            [SKIP, ...files],
            question
        );
        if (!picked || picked === SKIP) return "";
        return picked.basename;
    };

    const owner = await pickOne("Quest owner? (NPC or Faction)", new Set(["npc", "faction"]));
    variables.owner = owner ? `"[[${owner}]]"` : "";

    const location = await pickOne("Quest location?", new Set(["location", "establishment"]));
    variables.locations = location ? `\n  - "[[${location}]]"` : "";
};
