function getThisGameNum (tp) {
    const folders = tp.file.folder(true).split('/')
    const thisCampaign = folders.slice(1, 2)
    let numOfGames = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisCampaign[0]}/sessions"`)
        .where(page => {
            if (page.type === 'session') {
                if (page.campaign === thisCampaign[0]) {
                    return true;
                }
            }
        }).length
    numOfGames = JSON.stringify(numOfGames+1);
    while (numOfGames.length < 3) {
        numOfGames = "0" + numOfGames;
    }
    return numOfGames;
}
module.exports = getThisGameNum;