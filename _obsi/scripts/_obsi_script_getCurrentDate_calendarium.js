function _obsi_script_getCurrentDate_calendarium(tp) {
  const folders = tp.file.folder(true).split("/");
  const thisCampaign = folders.slice(1, 2);
  let calendarName = "";
  app.plugins.plugins.dataview.api
    .pages(`"Campaigns/${thisCampaign[0]}"`)
    .where((page) => {
      if (page.type === "campaign") {
        console.log(page);
        calendarName = page.calendarium;
        return true;
      }
    });
  const calendarAPI = Calendarium.getAPI(calendarName);
  const currentDate = calendarAPI.getCurrentDate();
  return `${currentDate.year}-${currentDate.month+1}-${currentDate.day}`;
}
module.exports = _obsi_script_getCurrentDate_calendarium;
