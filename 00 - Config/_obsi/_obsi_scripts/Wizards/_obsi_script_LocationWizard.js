// Top-level location wizard — prompts name, then the PARENT location, then the
// type (restricted to what may legally nest under that parent).
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". This script then
// overwrites folderName with the full destination folder, so the macro's
// template step writes to {{VALUE:folderName}} alone:
//   with a parent   -> {parent folder}/{tier folder}/{name}/{name}.md
//   without a parent-> {campaign}/World/Locations/{tier folder}/{name}/{name}.md
//
// Asking for the parent BEFORE the type is what lets us gate the type list —
// see Helpers/_obsi_script_LocationHierarchy.js for the nesting rules.
module.exports = async (params) => {
    const { app, quickAddApi, variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const Notice = params?.obsidian?.Notice;
    const path = require("path");
    const helper = (file) => require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/" + file
    ));
    const iconRegistry = helper("_obsi_script_IconRegistry.js");
    const hierarchy = helper("_obsi_script_LocationHierarchy.js")();

    const NO_PARENT = "— No parent (top-level) —";
    const HAS_PARENT = "Yes — pick a parent location";
    const NO = "No — this is a top-level location";

    const campaignRoot = variables.folderName;
    const categories = iconRegistry("location");

    const name = await quickAddApi.inputPrompt("Location name?");
    if (!name) cancel();

    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();

    // 1. Parent first — its tier decides which types are offered below.
    let parent = null;
    const candidates = campaignRoot
        ? app.vault.getMarkdownFiles()
            .filter(f => f.path.startsWith(campaignRoot + "/")
                && f.basename !== name
                && typeOf(f) === "location")
            .sort((a, b) => a.basename.localeCompare(b.basename))
        : [];

    if (candidates.length) {
        const wantsParent = await quickAddApi.suggester(
            [HAS_PARENT, NO],
            [HAS_PARENT, NO],
            "Does this location have a parent location?"
        );
        if (!wantsParent) cancel();

        if (wantsParent === HAS_PARENT) {
            // Offer the note the button was clicked from first, when it is a location.
            const active = app.workspace.getActiveFile?.();
            const isActiveLocation = active && typeOf(active) === "location"
                && candidates.some(f => f.path === active.path);
            const ordered = isActiveLocation
                ? [active, ...candidates.filter(f => f.path !== active.path)]
                : candidates;
            const labels = ordered.map(f =>
                isActiveLocation && f.path === active.path
                    ? `${f.basename}  (current note)`
                    : f.basename
            );

            const picked = await quickAddApi.suggester(
                [NO_PARENT, ...labels],
                [NO_PARENT, ...ordered],
                "Parent location?"
            );
            if (!picked) cancel();
            if (picked !== NO_PARENT) parent = picked;
        }
    }

    // 2. Type — gated by the parent's tier.
    const parentFm = parent ? app.metadataCache.getFileCache(parent)?.frontmatter : null;
    const parentTier = parent ? hierarchy.tierOf(parentFm, categories) : null;
    const available = parent
        ? hierarchy.allowedChildTypes(categories, parentTier)
        : categories;

    if (!available.length) {
        if (Notice) new Notice(`No location type can nest under ${parent.basename}.`);
        cancel();
    }

    const picked = await quickAddApi.suggester(
        available.map(c => c.label),
        available,
        parent ? `Location type? (inside ${parent.basename})` : "Location type?"
    );
    if (!picked) cancel();

    variables.name = name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.leader = "";
    variables.terrain = "";
    variables.description = "";
    variables.word_description = "";
    variables.fileName = name;
    variables.location_type = picked.label;
    variables.icon = picked.icon;
    variables.location_tier_level = picked.tier === null ? "" : String(picked.tier);
    variables.locations = parent ? `\n  - "[[${parent.basename}]]"` : "";

    const baseFolder = parent
        ? hierarchy.folderUnderParent(parent.parent?.path || campaignRoot, picked)
        : hierarchy.folderAtCampaignRoot(campaignRoot, picked);
    variables.folderName = `${baseFolder}/${name}`;
};
