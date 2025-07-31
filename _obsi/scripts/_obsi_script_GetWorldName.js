function _obsi_script_GetWorldName (tp) {
    const folders = tp.file.folder(true).split('/')
    const originFolder = folders.slice(1, 2);
    let worldSettingName = '';
    let world1 = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${originFolder[0]}"`)
        .where(page => {
            if(page.type === "campaign") {
                let arr = page.world.path.split('/');
                worldSettingName = arr[arr.length - 1].replace(/\.[^/.]+$/, "");
                return true;
            }
        });
    if(worldSettingName === '') {
        let world2 = app.plugins.plugins.dataview.api
            .pages(`"Worlds/${originFolder[0]}"`)
            .where(page => {
                if(page.type === "world") {
                    worldSettingName = page.world;
                    return true;
                }
            });
    }
    return "[[" +worldSettingName + "]]";
}
module.exports = _obsi_script_GetWorldName;

// The goal of this script is for campaign & world to have the
// child folders to have the same World setting target as
// the campaign.
// It set the world Name in the headerss