// The zero-padded number of the session being created, for Template_Session's
// `session_num`. Must agree with the filename `GetThisSessionName` picked.
//
// That resolver runs BEFORE the note exists, so it counts the sessions already
// there and adds one. This one runs from inside the template, after the file is
// created — whether Dataview's index has picked it up yet is a race, and counting
// blind gave "000" for the first session of a campaign while the filename said
// "001". Excluding the current note BY PATH and then adding one is correct either
// way, indexed or not — the same fix `GetLastGameTitle` uses.
function _obsi_script_GetThisGameNum (tp) {
    const campaign = tp.file.folder(true).split('/').slice(1, 2)[0];
    const self = tp.file.path(true);
    const played = app.plugins.plugins.dataview.api
        .pages(`"01 - Campaigns/${campaign}/Sessions"`)
        .where(page => page.type === 'session' && page.file.path !== self)
        .length;

    return "\"" + String(played + 1).padStart(3, "0") + "\"";
}
module.exports = _obsi_script_GetThisGameNum;
