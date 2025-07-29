module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().path;
    const myArray = path.split('/');
    let thisCampaign = myArray[1];
    let numOfGames = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisCampaign}/sessions"`)
        .where(page => {
            if (page.type === 'session') {
                if (page.campaign === thisCampaign) {
                    return true;
                }
            }
        }).length
    // console.log('numOfGames: ' + numOfGames);
    numOfGames = JSON.stringify(numOfGames+1);
    while (numOfGames.length < 3) {
        numOfGames = "0" + numOfGames;
    }
    // Get the date
    let dateNow = moment().format('YYYYMMDD'); // now() -> 20230123

    // Put filename together
    let filename = numOfGames + '_' + dateNow;
    params.variables["thisGameFilename"] = filename;
    params.variables["folderName"] = 'Campaigns/' + thisCampaign;    
};