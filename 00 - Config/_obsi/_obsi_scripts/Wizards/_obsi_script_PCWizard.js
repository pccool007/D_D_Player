// PC wizard — one form: character name, class (which drives icon/iconColor), the
// real person playing them, and the character's race.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}"; the macro's template step
// appends /PC.
//
// `race` is the same creature-type list `Macro - Add NPC` offers — one vocabulary
// for every character in the vault, and the same list metadata-menu's `race` preset
// is generated from, so the wizard and the property dropdown agree.
module.exports = async (params) => {
    const { variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const path = require("path");
    const form = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_WizardForm.js"
    ))(params);

    const OTHER = "Other";
    const UNKNOWN_RACE = "Unknown";

    const answers = await form.formPrompt({
        title: "New player character",
        saveLabel: "Create character",
        fields: [
            { key: "name", label: "Character name", required: true, placeholder: "Grish Ironhand" },
            form.typeField({ key: "class", label: "Class", domain: "pc", value: OTHER }),
            { key: "player", label: "Who plays them?", placeholder: "Real name" },
            form.typeField({
                key: "race",
                label: "Race",
                domain: "npc",
                value: UNKNOWN_RACE,
                description: "Creature type — the same list NPCs use. Unknown if not sure yet.",
            }),
        ],
    });
    if (!answers) cancel();

    const style = form.styleFor("pc", answers.class);

    variables.name = answers.name;
    variables.fileName = answers.name;
    // "Other" is the catch-all option, not a class — leave the property empty so
    // the roster does not display it.
    variables.class = answers.class === OTHER ? "" : answers.class;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.player = form.plain(answers.player);
    // A registry label, so the template's unquoted `race:` slot is safe.
    variables.race = answers.race;
};
