function getThisCampaignName (tp) {
    const folders = tp.file.folder(true).split('/')
    const parentFolder = folders.slice(1, 2)
    if (parentFolder == "Name of folder"){
        return "Name of world";
    }
    return parentFolder;
}
module.exports = getThisCampaignName;