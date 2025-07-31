function _obsi_script_get_calendarium (tp) {
    const folders = tp.file.folder(true).split('/')
    const thisCampaign = folders.slice(1, 2)
    let calendarName = '';
    app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${thisCampaign[0]}"`)
        .where(page => {
            if (page.type === 'campaign') {
                console.log(page);
                calendarName = page.calendarium;
                return true
            }
        });
    console.log(calendarName);
    return calendarName;
}
module.exports = _obsi_script_get_calendarium;