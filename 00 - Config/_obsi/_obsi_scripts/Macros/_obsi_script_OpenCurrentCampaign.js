// Open + pin the campaign you're currently playing, in reading view.
//
// A Macro (not a Wizard): it touches existing notes and runs no template step.
//
// Adapted from the GM vault, which reads a `current_campaign` field out of a
// config note. This vault has no config note, so "current" is resolved as:
//   1. the campaign whose Sessions folder holds a session dated today, else
//   2. the only campaign with status Active, else
//   3. a suggester over every Active campaign (or all campaigns if none are).
//
// When a session is dated today it is pinned alongside the manager, so starting
// a game session is one click.
module.exports = async (params) => {
    const { app, quickAddApi } = params;

    const notify = (msg) => {
        try { new Notice(msg); } catch (e) { console.log("[OpenCurrentCampaign]", msg); }
    };

    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
    const fm = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};

    const campaigns = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith("01 - Campaigns/") && typeOf(f) === "campaign")
        .sort((a, b) => a.basename.localeCompare(b.basename));

    if (!campaigns.length) { notify("No campaign notes found under 01 - Campaigns/."); return; }

    const today = window.moment ? window.moment().format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10);

    // Today's session, if any — also decides which campaign is "current".
    const sessionToday = (campaignFile) => {
        const folder = campaignFile.parent?.path;
        if (!folder) return null;
        return app.vault.getMarkdownFiles().find(f =>
            f.path.startsWith(`${folder}/Sessions/`)
            && typeOf(f) === "session"
            && String(fm(f).date ?? "").slice(0, 10) === today) ?? null;
    };

    const isActive = (f) => String(fm(f).status ?? "").toLowerCase().includes("active");

    let picked = null;
    let todaySession = null;

    for (const c of campaigns) {
        const s = sessionToday(c);
        if (s) { picked = c; todaySession = s; break; }
    }

    if (!picked) {
        const active = campaigns.filter(isActive);
        const pool = active.length ? active : campaigns;
        if (pool.length === 1) {
            picked = pool[0];
        } else {
            picked = await quickAddApi.suggester(
                pool.map(f => {
                    const st = fm(f).status;
                    return st ? `${f.basename} — ${st}` : f.basename;
                }),
                pool,
                "Which campaign?"
            );
            if (!picked) return;
        }
        todaySession = sessionToday(picked);
    }

    // --- open + pin ------------------------------------------------------

    const toReadingView = async (leaf) => {
        const state = leaf.view?.getState?.() ?? {};
        if (state.mode === "preview") return;
        await leaf.setViewState({ type: "markdown", state: { ...state, mode: "preview" }, active: true });
    };

    // Reuses a tab already showing the file so repeated runs don't pile up duplicates.
    const openPinned = async (file, { reuseActive = false } = {}) => {
        const existing = app.workspace.getLeavesOfType("markdown")
            .find(l => l.view?.file?.path === file.path);
        if (existing) {
            app.workspace.setActiveLeaf(existing, { focus: true });
            await toReadingView(existing);
            existing.setPinned(true);
            return existing;
        }
        const leaf = app.workspace.getLeaf(reuseActive ? false : "tab");
        await leaf.openFile(file, { state: { mode: "preview" } });
        leaf.setPinned(true);
        return leaf;
    };

    const names = [picked.basename];
    await openPinned(picked, { reuseActive: true });
    if (todaySession) {
        await openPinned(todaySession);
        names.push(todaySession.basename);
    }

    notify(`Pinned ${names.join(" + ")}`);
};
