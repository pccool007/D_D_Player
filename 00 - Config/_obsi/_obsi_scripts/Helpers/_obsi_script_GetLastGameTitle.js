// Path (without ".md") of the session before this one, for Template_Session's
// Recap embeds. Returns "" when there is no previous session, so the template can
// omit the embeds — an unresolved ![[…#^summary]] renders as a broken embed.
//
// The current note is excluded BY PATH rather than by taking the second-to-last
// entry: whether Dataview's index has already picked up the just-created file is a
// race, and "second-to-last" silently assumed it always had.
//
// Sorting on `session_num` (not `sessionNum` — that key does not exist, so the
// sort was a no-op and the "previous" session was whichever order Dataview
// happened to return). Values are zero-padded strings ("001"), so a plain string
// sort is correct.
function lastGameTitle (tp) {
    const campaign = tp.file.folder(true).split('/').slice(1, 2)[0];
    const self = tp.file.path(true);
    const sessions = app.plugins.plugins.dataview.api
        .pages(`"01 - Campaigns/${campaign}/Sessions"`)
        .where(page => page.type === 'session' && page.file.path !== self)
        .sort(page => page.session_num)
        .array();

    if (!sessions.length) return "";
    return sessions[sessions.length - 1].file.path.replace(/\.md$/, "");
}
module.exports = lastGameTitle;
