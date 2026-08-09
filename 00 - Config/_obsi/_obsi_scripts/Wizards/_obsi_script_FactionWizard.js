// Faction wizard — one form: name, faction type, an optional parent faction picked
// from the factions already in this campaign, the NPC who leads it, and the
// locations it holds (several, since a faction rarely sits in one place).
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". This script then
// overwrites folderName with the full destination, so the macro's template step
// writes to {{VALUE:folderName}} alone:
//   without a parent -> {campaign}/World/Factions/{name}.md
//   with a parent    -> {campaign}/World/Factions/sub-factions/{parent}/{name}.md
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

    const campaignRoot = form.campaignRoot();
    if (!campaignRoot) {
        if (Notice) new Notice("Cannot resolve the campaign folder — open a note inside a campaign first.");
        cancel();
    }

    const factions = form.notesOf(campaignRoot, ["faction"]);
    const npcs = form.notesOf(campaignRoot, ["npc"]);
    const places = form.notesOf(campaignRoot, ["location", "establishment"]);
    const dimensions = form.dimensionsIn(campaignRoot);
    const scope = form.dimensionScope(dimensions);

    const answers = await form.formPrompt({
        title: "New faction",
        saveLabel: "Create faction",
        fields: [
            { key: "name", label: "Faction name", required: true, placeholder: "The Harpers" },
            form.typeField({ key: "faction_type", label: "Faction type", domain: "faction" }),
            form.dimensionField({
                root: campaignRoot,
                description: "Leads its `locations`, and narrows the picker below.",
            }),
            form.noteField({
                key: "parent_faction",
                label: "Parent faction",
                files: factions,
                description: "Files this one as a sub-faction underneath it.",
                emptyHint: "No other faction in this campaign yet.",
            }),
            form.noteField({
                key: "leader",
                label: "Leader",
                files: npcs,
                description: "The NPC who runs it.",
                emptyHint: "No NPC in this campaign yet.",
            }),
            {
                ...form.noteMultiField({
                    key: "locations",
                    label: "Locations",
                    files: places,
                    description: "Bases and territory — opens a picker. The chosen dimension is always included.",
                    emptyHint: "No location or establishment in this campaign yet.",
                }),
                dependsOn: "dimension",
                // The dimension itself is added on save regardless, so offering it as a
                // tickable row would be a choice that changes nothing.
                optionsFor: (dimension) => (places.length
                    ? scope(dimension, places)
                        .filter(f => f.basename !== dimension)
                        .map(f => [f.basename, f.basename, f.path])
                    : []),
            },
        ],
    });
    if (!answers) cancel();

    // A faction cannot be its own parent — the picker is built before the name is
    // typed, so it cannot filter the note out in advance.
    const parent = answers.parent_faction === answers.name ? "" : answers.parent_faction;
    const style = form.styleFor("faction", answers.faction_type);

    variables.name = answers.name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path. `leader` is
    // asked for now, but still has to be assigned: form.link() returns "" when the
    // picker was skipped, which is exactly what the blank line used to provide.
    variables.leader = form.link(answers.leader);
    variables.goal = "";
    variables.description = "";
    variables.word_description = "";
    variables.emblem_description = "";
    variables.fileName = answers.name;
    variables.faction_type = answers.faction_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    // Scalar, not a list: a faction has one parent, and the metadata-menu preset
    // that edits this field afterwards is a single-value File picker.
    variables.parent_faction = form.link(parent);
    variables.locations = form.yamlList(
        form.withDimension(campaignRoot, answers.dimension, answers.locations));

    const factionsRoot = `${campaignRoot}/World/Factions`;
    variables.folderName = parent
        ? `${factionsRoot}/sub-factions/${parent}`
        : factionsRoot;
};
