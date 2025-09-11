function _obsi_script_GetWorldName (tp) {
    console.log("_obsi_script_GetWorldName.js launched");
    console.log("test");
    const folders = tp.file.folder(true).split('/')
    const originFolder = folders.slice(1, 2);
    console.log("originFolder: " + originFolder);
    let worldSettingName = '';
    console.log(originFolder[0])
    let world1 = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${originFolder[0]}"`)
        .where(page => {
            console.log("page: " + page.type);
            if(page.type === "campaign") {
                worldSettingName = page.world
                console.log("worldSettingName: " + worldSettingName);
                return true;
            }
        });
    return "[[" +worldSettingName + "]]";
}
module.exports = _obsi_script_GetWorldName;

// The goal of this script is for campaign & world to have the
// child folders to have the same World setting target as
// the campaign.
// It set the world Name in the headerss