module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().path;
    const myArray = path.split('/');
    let thisCampaign = myArray[1];
    let worldSettingName = 'Not found';
    let world = app.plugins.plugins.dataview.api
        .page(`Campaigns/${thisCampaign}/${thisCampaign}`);
    if(world.world[0]){
        worldSettingName = world.world[0].path.split('/').slice(1, 2);
    } else {
        worldSettingName = world.world.path.split('/').slice(1, 2);
    }
    worldSettingName = world.world.path.split('/').slice(1, 2);
    params.variables["folderName"] = 'Worlds/' + worldSettingName[0];    
};

// In a Campaign i want to put Factions and NPC's in the world folder