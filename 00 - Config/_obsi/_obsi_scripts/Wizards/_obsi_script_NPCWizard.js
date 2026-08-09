// NPC wizard — one form: name, creature-type race (which drives icon/iconColor),
// gender, the location they were met at, and the factions they belong to.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". The macro's template step
// writes to {{VALUE:folderName}}/World/NPC, so the race subfolder is carried in
// fileName instead of folderName:
//   {campaign}/World/NPC/{race}/{name}.md
//
// `race` here is the 5e creature type. A player-facing race (Half-Elf, Tiefling…)
// belongs in the template's `subRace` field, which is left blank for the GM to fill.
// The creature type also picks the default portrait, the same way it picks the icon.
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

    // Mirrors the `gender` ValuesList in .obsidian/plugins/metadata-menu/data.json —
    // keep the two in sync so the wizard and the property dropdown offer the same set.
    const GENDERS = ["Male", "Female", "Non-binary", "Unknown", "Other"];
    // The README's answer for "I don't know what they are yet", so it is the default.
    const UNKNOWN_RACE = "Unknown";

    const campaignRoot = form.campaignRoot();
    if (!campaignRoot) {
        if (Notice) new Notice("Cannot resolve the campaign folder — open a note inside a campaign first.");
        cancel();
    }

    const places = form.notesOf(campaignRoot, ["location", "establishment"]);
    const factions = form.notesOf(campaignRoot, ["faction"]);
    const dimensions = form.dimensionsIn(campaignRoot);
    const scope = form.dimensionScope(dimensions);

    const answers = await form.formPrompt({
        title: "New NPC",
        saveLabel: "Create NPC",
        fields: [
            { key: "name", label: "NPC name", required: true, placeholder: "Elowen Marsh" },
            form.dimensionField({
                root: campaignRoot,
                description: "Leads their `locations`, and narrows the list below.",
            }),
            form.typeField({
                key: "race",
                label: "Creature type",
                domain: "npc",
                value: UNKNOWN_RACE,
                description: "Files the note under World/NPC/{type}. Pick Unknown if you are not sure.",
            }),
            {
                key: "gender",
                label: "Gender",
                type: "select",
                value: "",
                options: [[form.SKIP, ""], ...GENDERS.map(g => [g, g])],
            },
            {
                ...form.noteField({
                    key: "where",
                    label: "Where were they met?",
                    files: places,
                    description: "Also fills first seen and last seen.",
                    emptyHint: "No location or establishment in this campaign yet.",
                }),
                dependsOn: "dimension",
                optionsFor: (dimension) => (places.length
                    ? [[form.SKIP, ""], ...scope(dimension, places).map(f => [f.basename, f.basename])]
                    : []),
            },
            form.noteMultiField({
                key: "factions",
                label: "Factions",
                files: factions,
                description: "Opens a picker — tick as many as apply.",
                emptyHint: "No faction in this campaign yet.",
            }),
        ],
    });
    if (!answers) cancel();

    const style = form.styleFor("npc", answers.race);

    variables.name = answers.name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.subRace = "";
    variables.age = "";
    variables.occupation = "";
    variables.description = "";
    variables.word_description = "";
    variables.fileName = `${answers.race}/${answers.name}`;
    variables.race = answers.race;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    // The creature type's default portrait, from IconRegistry like icon/iconColor —
    // never a free choice. A bare basename; Template_NPC wraps it in [[…]]. Every
    // path that expands that template must set this, or QuickAdd prompts for it.
    variables.npcImg = style.placeholder;
    variables.gender = answers.gender;
    // Where they were met is also where they were first met and last seen — the GM
    // moves last_seen on later. `locations` is a YAML list; the other two are scalars.
    // The chosen dimension leads that list whatever was picked, so an NPC met nowhere in
    // particular still has a home — it is not where they were *met*, so the two scalars
    // stay the answer alone.
    variables.locations = form.yamlList(form.withDimension(campaignRoot, answers.dimension, answers.where));
    variables.first_location = form.link(answers.where);
    variables.last_seen = form.link(answers.where);
    variables.factions = form.yamlList(answers.factions);
};
