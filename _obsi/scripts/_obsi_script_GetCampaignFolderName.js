function campaignFolderName (tp, subFolder = '/Quests') {
    const folders = tp.file.folder(true).split('/')
    const thisCampaign = folders.slice(1, 2)
    return `Campaigns/${thisCampaign}${subFolder}`;
}
module.exports = campaignFolderName;