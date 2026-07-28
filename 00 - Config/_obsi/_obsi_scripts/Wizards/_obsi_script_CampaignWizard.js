// Campaign wizard — one form for everything a new campaign needs, then the macro
// creates two notes from it:
//   1. the campaign manager  -> 01 - Campaigns/{Campaign}/{Campaign}.md
//   2. its main world        -> 01 - Campaigns/{Campaign}/World/Locations/Dimensions/{World}/{World}.md
//
// The world is a tier-0 Dimension location (see Helpers/_obsi_script_LocationHierarchy.js),
// which is the top of the location hierarchy — so continents, regions and
// everything below can nest inside it afterwards.
//
// Sets, for the campaign template step:
//   fileName, folderName, world, campaign_start, dndbeyond_url, recurrence
// Sets, for the world-location template step:
//   worldFileName, worldFolderName, icon, location_type, location_tier_level, locations
//
// Folder/file name for the campaign is underscored (`Tides_of_Fates`) — the vault
// convention every view reverses with .replace(/_/g, " ") for display.
//
// Cancelling throws the string "cancelled", which is how QuickAdd aborts a macro
// mid-run; returning quietly would let the template steps create empty notes.
module.exports = async (params) => {
    const { app, variables } = params;
    const Notice = params?.obsidian?.Notice;
    const path = require("path");
    const helper = (file) => require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/" + file
    ));
    const iconRegistry = helper("_obsi_script_IconRegistry.js");
    const hierarchy = helper("_obsi_script_LocationHierarchy.js")();
    const formPrompt = helper("_obsi_script_FormPrompt.js");

    const CAMPAIGNS_ROOT = "01 - Campaigns";
    const WORLD_LOCATION_TYPE = "Dimension";

    const cancel = () => { variables.cancelled = true; throw "cancelled"; };

    const answers = await formPrompt({
        title: "New campaign",
        saveLabel: "Create campaign",
        fields: [
            {
                key: "campaign",
                label: "Campaign name",
                required: true,
                placeholder: "Tides of Fates",
                description: "Names the campaign folder and its manager note.",
            },
            {
                key: "world",
                label: "World name",
                required: true,
                placeholder: "Aethyr",
                description: "Creates the campaign's main world — a top-level Dimension location.",
            },
            {
                key: "campaign_start",
                label: "Campaign start",
                type: "date",
                value: window.moment().format("YYYY-MM-DD"),
                description: "First session's date. Drives the expected-session count on the campaign card.",
            },
            {
                key: "dndbeyond_url",
                label: "D&D Beyond URL",
                type: "url",
                placeholder: "https://www.dndbeyond.com/campaigns/…",
                description: "Optional.",
            },
            {
                key: "recurrence",
                label: "Session cadence",
                type: "select",
                value: "1",
                options: [
                    ["Weekly", "1"],
                    ["Every 2 weeks", "2"],
                    ["Every 3 weeks", "3"],
                    ["Every 4 weeks", "4"],
                ],
            },
        ],
    });
    if (!answers) cancel();

    const campaignName = answers.campaign.replace(/\s+/g, "_");
    const campaignRoot = `${CAMPAIGNS_ROOT}/${campaignName}`;
    if (app.vault.getAbstractFileByPath(campaignRoot)) {
        if (Notice) new Notice(`Campaign "${campaignName}" already exists.`);
        cancel();
    }

    variables.fileName = campaignName;
    variables.folderName = campaignRoot;
    variables.world = answers.world;
    variables.campaign_start = answers.campaign_start;
    variables.dndbeyond_url = answers.dndbeyond_url;
    variables.recurrence = answers.recurrence;

    const dimension = iconRegistry("location").find(c => c.label === WORLD_LOCATION_TYPE);
    variables.worldFileName = answers.world;
    variables.worldFolderName =
        `${hierarchy.folderAtCampaignRoot(campaignRoot, dimension)}/${answers.world}`;
    variables.icon = dimension.icon;
    variables.location_type = dimension.label;
    variables.location_tier_level = String(dimension.tier);
    variables.locations = "";

    // The world note's `world:` field comes from Helpers/_obsi_script_GetWorldName.js,
    // which reads the campaign's frontmatter — and the campaign note is created only
    // moments earlier in this same macro, too fast for Dataview's index. Hand the
    // answer over directly so that lookup never comes up empty.
    window._obsiPendingWorldName = { campaign: campaignName, world: answers.world };
};
