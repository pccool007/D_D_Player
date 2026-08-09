// Lore wizard — one form: name, lore type (which drives icon/iconColor), the
// dimension it belongs to, and the lore it relates to, since a piece of lore is
// usually a retelling of something already recorded. `relations` is a YAML list, so
// that picker takes several.
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
        ],
    });
    if (!answers) cancel();

    // Nothing relates to itself — the picker is built before the name is typed, so
    // it cannot filter the note out in advance.
    const related = answers.relations.filter(n => n !== answers.name);
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
