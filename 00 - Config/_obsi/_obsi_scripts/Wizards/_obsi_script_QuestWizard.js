// Quest wizard — one form: name, reward, and campaign-filtered pickers for the
// quest's Owner (one NPC or Faction) and its Locations (several — `locations` is a
// YAML list, and a quest rarely stays in one place).
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}"; the macro's template step
// appends /Quests.
//
// quest_status is not asked: a brand-new quest is always "To Do". The icon still
// comes from IconRegistry so quest styling lives in one place.
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

    const INITIAL_STATUS = "To Do";

    const campaignRoot = form.campaignRoot();
    if (!campaignRoot) {
        if (Notice) new Notice("Cannot resolve the campaign folder — open a note inside a campaign first.");
        cancel();
    }

    const owners = form.notesOf(campaignRoot, ["npc", "faction"]);
    // The campaign world is added to `locations` on save regardless, so offering it as
    // a tickable row would be a choice that changes nothing.
    const places = form.notesOf(campaignRoot, ["location", "establishment"], {
        exclude: form.worldName(campaignRoot),
    });

    const answers = await form.formPrompt({
        title: "New quest",
        saveLabel: "Create quest",
        fields: [
            { key: "name", label: "Quest name", required: true, placeholder: "The Amberhall Contract" },
            { key: "reward", label: "Reward", placeholder: "Gold, item, favor…" },
            form.noteField({
                key: "owner",
                label: "Quest owner",
                files: owners,
                description: "The NPC or faction who handed it out.",
                emptyHint: "No NPC or faction in this campaign yet.",
            }),
            form.noteMultiField({
                key: "locations",
                label: "Quest locations",
                files: places,
                description: "Everywhere it takes you — opens a picker. The campaign world is always included.",
                emptyHint: "No location or establishment in this campaign yet.",
            }),
        ],
    });
    if (!answers) cancel();

    const style = form.styleFor("quest", INITIAL_STATUS);

    variables.name = answers.name;
    variables.fileName = answers.name;
    variables.reward = form.plain(answers.reward);
    variables.quest_status = INITIAL_STATUS;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.owner = form.link(answers.owner);
    variables.locations = form.yamlList(form.withWorld(campaignRoot, answers.locations));
};
