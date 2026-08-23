// Lore wizard — one form: name, lore type (which drives icon/iconColor), the
// dimension it belongs to, and who or what it relates to: other lore (a piece of
// lore is usually a retelling of something already recorded), the PCs it touches,
// and the NPCs it touches.
//
// THREE pickers, ONE field. All of them feed `relations`, because that is the field
// the scoped "Lores" callouts filter on — an NPC, PC, faction or location page
// collects the lore whose `relations` names it (see the `lore_table` view). Storing
// the NPCs somewhere else would mean the lore never showed up on their page, which
// is the whole point of relating them. The pickers exist so you do not have to know
// that, and so each one only offers notes of its own kind.
//
// No finer location than the dimension is asked for — a lore entry's place is usually
// a whole realm, and the GM narrows it afterwards through the `locations` property.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}"; the macro's template step
// appends /World/Lores.
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

    const lores = form.notesOf(campaignRoot, ["lore"]);
    const players = form.notesOf(campaignRoot, ["player"]);
    const npcs = form.notesOf(campaignRoot, ["npc"]);

    const answers = await form.formPrompt({
        title: "New lore",
        saveLabel: "Create lore",
        fields: [
            { key: "name", label: "Lore name", required: true, placeholder: "The Sundering" },
            form.typeField({ key: "lore_type", label: "Lore type", domain: "lore" }),
            form.dimensionField({
                root: campaignRoot,
                description: "The realm this belongs to — narrow it further afterwards through the property.",
            }),
            form.noteMultiField({
                key: "relations",
                label: "Related lore",
                files: lores,
                description: "The entries this one retells or builds on — opens a picker.",
                emptyHint: "No other lore in this campaign yet.",
            }),
            form.noteMultiField({
                key: "players",
                label: "Related players",
                files: players,
                description: "The PCs this is about — whose memory it is, who the prophecy names.",
                emptyHint: "No player character in this campaign yet.",
            }),
            form.noteMultiField({
                key: "npcs",
                label: "Related NPCs",
                files: npcs,
                description: "The NPCs this is about — it shows up in their Lores table.",
                emptyHint: "No NPC in this campaign yet.",
            }),
        ],
    });
    if (!answers) cancel();

    // The three pickers are one `relations` list. A disabled picker (nothing of that
    // kind in the campaign yet) reads as [], so all three always spread.
    //
    // Deduplicated because a lore entry and an NPC may share a name, and nothing
    // relates to itself — the pickers are built before the name is typed, so they
    // cannot filter this note out in advance.
    const related = [...new Set([...answers.relations, ...answers.players, ...answers.npcs])]
        .filter(n => n !== answers.name);
    const style = form.styleFor("lore", answers.lore_type);

    variables.name = answers.name;
    variables.fileName = answers.name;
    variables.lore_type = answers.lore_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.relations = form.yamlList(related);
    // The dimension alone — the GM narrows it afterwards through the `locations`
    // property. Assigning it is not optional: an unset {{VALUE:x}} makes QuickAdd stop
    // and prompt for it.
    variables.locations = form.yamlList(form.withDimension(campaignRoot, answers.dimension, []));
};
