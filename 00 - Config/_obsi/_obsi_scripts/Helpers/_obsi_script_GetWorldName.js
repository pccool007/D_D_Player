// The campaign note stores `world:` as a wikilink so the manager shows a clickable
// world; every other template wants the bare name, so unwrap whatever shape the
// campaign's frontmatter comes back as (Dataview Link object or raw "[[Name]]").
function bareWorldName (value) {
    if (!value) return '';
    if (typeof value === "object") return value.path?.split('/').pop().replace(/\.md$/, '') || '';
    return String(value).replace(/^\s*\[\[|\]\]\s*$/g, '').split('|').pop().split('/').pop();
}

function _obsi_script_GetWorldName (tp) {
    const folders = tp.file.folder(true).split('/')
    const originFolder = folders.slice(1, 2);
    const campaignName = originFolder[0];

    // CampaignWizard's handoff — checked first because during "Macro - Create
    // Campaign" the world note is written moments after the campaign note, well
    // before either Dataview or the metadata cache has seen it.
    const pending = window._obsiPendingWorldName;
    if (pending && pending.campaign === campaignName) return pending.world;

    let worldSettingName = '';
    let world1 = app.plugins.plugins.dataview.api
        .pages(`"01 - Campaigns/${campaignName}"`)
        .where(page => {
            if(page.type === "campaign") {
                worldSettingName = page.world
                return true;
            }
        });
    if (worldSettingName) return bareWorldName(worldSettingName);

    // Dataview's index lags right after a note is created; the metadata cache
    // resolves sooner, so fall back to the campaign note's own frontmatter.
    const managerNote = app.vault.getAbstractFileByPath(
        `01 - Campaigns/${campaignName}/${campaignName}.md`
    );
    return bareWorldName(
        managerNote && app.metadataCache.getFileCache(managerNote)?.frontmatter?.world
    );
}
module.exports = _obsi_script_GetWorldName;
// Templater registers the function itself; the attached property is inert there and
// is how _obsi_script_WizardForm.worldName() reuses this unwrapping instead of
// carrying a second copy of the regex.
module.exports.bareWorldName = bareWorldName;

// The goal of this script is for campaign & world to have the
// child folders to have the same World setting target as
// the campaign.
// It set the world Name in the headerss