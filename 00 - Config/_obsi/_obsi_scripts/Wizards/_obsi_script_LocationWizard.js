// Top-level location wizard — one form asking name, parent location and type,
// where the type list is gated by the parent's tier. The form itself lives in
// Helpers/_obsi_script_LocationForm.js, shared with the child-location wizard.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". The form then overwrites
// folderName with the full destination, so the macro's template step writes to
// {{VALUE:folderName}} alone:
//   with a parent    -> {parent folder}/{tier folder}/{name}/{name}.md
//   without a parent -> {campaign}/World/Locations/{tier folder}/{name}/{name}.md
const path = require("path");
module.exports = async (params) => {
    const locationForm = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_LocationForm.js"
    ));
    return await locationForm(params, { preferActiveAsParent: false });
};
