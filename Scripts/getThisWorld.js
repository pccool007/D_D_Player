function getThisWorld (tp) {
    const folders = tp.file.folder(true).split('/')
    const parentFolder = folders.slice(1, 2)
    let worldName = '';
    let world = app.plugins.plugins.dataview.api
    .pages(`"Campaigns/${parentFolder}"`)
    .where(page => {
        if (page.type === 'world') {
            worldName = page.world;
            return true;
        }
    })
    if(worldName !== ''){
        return worldName;
    } else {   
        return 'No world found';
    }
}
module.exports = getThisWorld;