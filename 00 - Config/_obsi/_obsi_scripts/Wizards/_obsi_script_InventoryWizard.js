// Inventory wizard — one form: name, item type (which drives icon/iconColor), an
// optional gold value, and an optional owner picked from the party's PCs.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}"; the macro's template step
// appends /Inventory.
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

    const pcs = form.notesOf(campaignRoot, ["player"]);

    const answers = await form.formPrompt({
        title: "New item",
        saveLabel: "Create item",
        fields: [
            { key: "name", label: "Item name", required: true, placeholder: "Sunblade" },
            form.typeField({ key: "item_type", label: "Item type", domain: "inventory" }),
            {
                key: "gold_value",
                label: "Gold value",
                type: "number",
                min: 0,
                placeholder: "Blank if unknown",
            },
            form.noteField({
                key: "owner",
                label: "Who carries it?",
                files: pcs,
                emptyHint: "No player character in this campaign yet.",
            }),
        ],
    });
    if (!answers) cancel();

    const style = form.styleFor("inventory", answers.item_type);

    variables.name = answers.name;
    variables.fileName = answers.name;
    variables.item_type = answers.item_type;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.gold_value = answers.gold_value;
    variables.owner = form.link(answers.owner);
};
