function _obsi_script_GetThisGameNum (tp) {
    const folders = tp.file.folder(true).split('/')
    const thisCampaign = folders.slice(1, 2)
    let numOfGames = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisCampaign[0]}/Sessions"`)
        .where(page => {
            if (page.type === 'session') {
                return true;
            }
        }).length
    numOfGames = JSON.stringify(numOfGames);
    while (numOfGames.length < 3) {
        numOfGames = "0" + numOfGames;
    }
    console.log(numOfGames);
    return numOfGames;
}
module.exports = _obsi_script_GetThisGameNum;