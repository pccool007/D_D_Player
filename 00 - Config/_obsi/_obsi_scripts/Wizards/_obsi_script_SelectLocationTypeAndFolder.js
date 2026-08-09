// Child-location wizard — the same form as _obsi_script_LocationWizard.js, but it
// pre-selects the note you clicked from as the parent. Used by
// "Macro - Add Location (Child)", the New Location button on a location note.
//
// That macro has NO folder resolver before it, so the form derives the campaign
// from the active note's path itself. Its template step writes to
// {{VALUE:folderName}}, which the form sets to the full destination:
//   {parent folder}/{tier folder}/{name}/{name}.md
const path = require("path");
module.exports = async (params) => {
    const locationForm = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_LocationForm.js"
    ));
    return await locationForm(params, { preferActiveAsParent: true });
};
