function lastGameTitle (tp) {
    console.log("lastGameTitle.js launched");
    const folders = tp.file.folder(true).split('/')
    console.log("folders: " + folders);
    const thisWorld = folders.slice(1, 2)
    console.log("thisWorld: " + thisWorld);
    const titles = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisWorld}/Sessions"`)
        .where(page => {
            console.log("page: " + page.type);
            if (page.type === 'session') {
                return true;
            }
        })
        .sort(b => b.sessionNum)
    console.log("titles: " + titles);
    if (titles.length > 1) {
        const filename = JSON.stringify(titles[titles.length-2].file.path).replace("\"","").replace("\"","").replace(".md","");
        return filename
    } else {
        return "No games found";
    }
    
}
module.exports = lastGameTitle;