function lastGameTitle (tp) {
    const folders = tp.file.folder(true).split('/')
    const thisWorld = folders.slice(1, 2)
    const titles = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisWorld}/Sessions"`)
        .where(page => {
            if (page.type === 'session') {
                return true;
            }
        })
        .sort(b => b.sessionNum)
    if (titles.length > 1) {
        const filename = JSON.stringify(titles[titles.length-2].file.path).replace("\"","").replace("\"","").replace(".md","");
        return filename
    } else {
        return "No games found";
    }
    
}
module.exports = lastGameTitle;