module.exports = (params) => {
    console.log("Start _obsi_script_SetParamsInCapGetCampaignFolder.js");
    let path = params.app.workspace.getActiveFile().path;
    const myArray = path.split('/');
    let thisCampaign = myArray[1];
    console.log("thisCampaign: " + thisCampaign);
    params.variables["folderName"] = 'Campaigns/' + thisCampaign;    
};

// Not sure being used