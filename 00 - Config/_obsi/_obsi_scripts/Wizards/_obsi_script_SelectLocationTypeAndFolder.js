// Child-location wizard: prompts Name, then confirms/picks the PARENT, then the
// Type — restricted to the tiers that may legally nest under that parent.
//
// Used by "Macro - Add Location (Child)", whose template step writes to
// {{VALUE:folderName}} — this script is the only thing that sets it, so no folder
// resolver runs before it.
//
// Each location is a folder note: the destination is
//   {parent folder}/{tier folder}/{name}/{name}.md
// e.g. a City created from a Country lands in …/{Country}/Cities/{Name}/{Name}.md
// With no parent it falls back to {campaign}/World/Locations/{tier folder}/{name}/{name}.md
//
// Nesting rules live in Helpers/_obsi_script_LocationHierarchy.js.
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
  const OTHER_PARENT = "— Pick another location —";

  const categories = iconRegistry("location");
  const activeFile = app?.workspace?.getActiveFile?.();
  const campaignRoot = activeFile
    ? "01 - Campaigns/" + activeFile.path.split("/")[1]
    : "";

  const typeOf = (f) =>
    String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();

  const name = await quickAddApi.inputPrompt("Location name?");
  if (!name) cancel();

  // 1. Parent first — the active note is the default, but it can be swapped or
  //    dropped. Its tier decides which types are offered below.
  let parent = activeFile && typeOf(activeFile) === "location" ? activeFile : null;

  const choices = parent
    ? [`${parent.basename}  (current note)`, OTHER_PARENT, NO_PARENT]
    : [OTHER_PARENT, NO_PARENT];
  const values = parent ? [parent, OTHER_PARENT, NO_PARENT] : [OTHER_PARENT, NO_PARENT];

  const answer = await quickAddApi.suggester(choices, values, "Parent location?");
  if (!answer) cancel();

  if (answer === NO_PARENT) {
    parent = null;
  } else if (answer === OTHER_PARENT) {
    const candidates = campaignRoot
      ? app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(campaignRoot + "/")
          && f.basename !== name
          && typeOf(f) === "location")
        .sort((a, b) => a.basename.localeCompare(b.basename))
      : [];
    if (!candidates.length) {
      if (Notice) new Notice("No other location found in this campaign.");
      cancel();
    }
    const pickedParent = await quickAddApi.suggester(
      [NO_PARENT, ...candidates.map(f => f.basename)],
      [NO_PARENT, ...candidates],
      "Parent location?"
    );
    if (!pickedParent) cancel();
    parent = pickedParent === NO_PARENT ? null : pickedParent;
  } else {
    parent = answer;
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

  if (!parent && !campaignRoot) {
    if (Notice) new Notice("Cannot resolve the campaign folder — open a campaign note first.");
    cancel();
  }

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
