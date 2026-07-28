module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().path;
    const myArray = path.split('/');
    let thisCampaign = myArray[1];
    params.variables["folderName"] = '01 - Campaigns/' + thisCampaign;    
};

// Not sure being used