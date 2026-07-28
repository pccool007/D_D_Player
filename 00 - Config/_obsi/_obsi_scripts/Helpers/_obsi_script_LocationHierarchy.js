// Shared location-hierarchy rules for the location wizards.
//
// Both wizards ask for the PARENT first, then restrict the type suggester to the
// tiers that may legally nest under that parent — this file is the single place
// where "legally nest" and "which folder does it land in" are defined.
//
// Usage (QuickAdd wizard scripts — require by absolute path):
//   const hierarchy = require(path.join(
//       app.vault.adapter.basePath,
//       "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_LocationHierarchy.js"
//   ))();
//
// Templater also auto-registers it as tp.user._obsi_script_LocationHierarchy().
//
// NOTE: Node's require() cache means edits here need an Obsidian reload to reach
// QuickAdd.

// tier -> containing folder name. A category may override it with its own
// `folder` key in the icon registry (e.g. Island sits at tier 4 but keeps
// "Island" as its folder).
const TIER_FOLDER = Object.freeze({
    0: "Dimensions",
    1: "Continents",
    2: "Regions",
    3: "Countries",
    4: "States",
    5: "Cities"
});

// Tier of an existing location note, from its frontmatter.
// Falls back to `location_type` for notes that predate `location_tier_level`.
// Returns null for environments (Forest, Dungeon, …) and unknown types.
const tierOf = (frontmatter, categories) => {
    const fm = frontmatter || {};
    const raw = fm.location_tier_level;
    if (raw !== "" && raw !== undefined && raw !== null) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return n;
    }
    if (fm.location_type) {
        const byType = (categories || []).find(c => c.label === fm.location_type);
        if (byType && byType.tier !== null && byType.tier !== undefined) return byType.tier;
    }
    return null;
};

// Types offered for a child of a location at `parentTier`.
// A tiered child must be STRICTLY deeper than its parent; environments
// (tier null) may nest anywhere. A null parentTier means "no restriction".
const allowedChildTypes = (categories, parentTier) => {
    const gated = parentTier !== null && parentTier !== undefined && !Number.isNaN(parentTier);
    if (!gated) return categories;
    return categories.filter(c => c.tier === null || c.tier > parentTier);
};

// Folder a location lands in when it has a parent: nested inside the parent's
// own folder, under the tier (or category) folder. Locations are folder notes,
// so callers append "/{name}".
const folderUnderParent = (parentFolder, picked) => {
    const bucket = picked.tier === null
        ? picked.label
        : (picked.folder ?? TIER_FOLDER[picked.tier]);
    return `${parentFolder}/${bucket}`;
};

// Folder a parentless location lands in: flat under the campaign's Locations
// root, in a folder named after its type.
const folderAtCampaignRoot = (campaignRoot, picked) =>
    `${campaignRoot}/World/Locations/${picked.label}`;

module.exports = () => ({
    TIER_FOLDER,
    tierOf,
    allowedChildTypes,
    folderUnderParent,
    folderAtCampaignRoot
});
