// The location form, shared by both location wizards.
//
// _obsi_script_LocationWizard.js ("Macro - Add Location") and
// _obsi_script_SelectLocationTypeAndFolder.js ("Macro - Add Location (Child)")
// were the same wizard twice, differing only in whether the note you clicked from
// is offered as the default parent. Both are now thin wrappers over this — the
// same shape ParseNPCCapture and friends use over ParseCapture.
//
// One form, four rows: Name · Dimension · Parent location · Location type, each
// narrowing the next. Dimension defaults to the campaign world and scopes the parent
// list to that dimension's subtree — the whole point, since picking the world out of
// every location in the campaign was the step you took every single time. The type
// list is REACTIVE off the parent: a child must sit at a strictly deeper tier, so the
// options rebuild whenever the parent changes, and a parent that admits no children (a
// City) leaves the row disabled with the reason on it. The nesting rules themselves
// stay in _obsi_script_LocationHierarchy.js.
//
// Inside a dimension the parent list LEADS WITH THE DIMENSION ITSELF rather than a
// "— Skip —" row, so `parent` is never empty and the type row always has a real tier
// to gate on. Filing outside every dimension — the only way to create a new one, since
// nothing nests at tier 0 under a tier-0 parent — is the Dimension row's own
// "— None —" option.
//
// Sets: name, leader, terrain, description, word_description, fileName,
//       location_type, icon, location_tier_level, locations, folderName
//
// NOTE: Node's require() cache means edits here need an Obsidian reload to reach
// QuickAdd.

module.exports = async (params, { preferActiveAsParent = false } = {}) => {
    const { variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const Notice = params?.obsidian?.Notice;
    const notify = (message) => {
        if (Notice) new Notice(message);
        else console.log("[LocationForm]", message);
    };

    const path = require("path");
    const helper = (file) => require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/" + file
    ));
    const form = helper("_obsi_script_WizardForm.js")(params);
    const hierarchy = helper("_obsi_script_LocationHierarchy.js")();
    const { app } = form;

    const categories = form.typesIn("location");
    const active = app.workspace.getActiveFile?.();

    // "Macro - Add Location (Child)" runs with no folder resolver before it, so it
    // has to derive the campaign from the note it was clicked in.
    const campaignRoot = form.campaignRoot()
        ?? form.campaignRoot(active ? "01 - Campaigns/" + active.path.split("/")[1] : "");
    if (!campaignRoot) {
        notify("Cannot resolve the campaign folder — open a note inside a campaign first.");
        cancel();
    }

    const candidates = form.notesOf(campaignRoot, ["location"]);
    const byName = new Map(candidates.map(f => [f.basename, f]));

    const tierUnder = (parentName) => {
        const parent = byName.get(parentName);
        if (!parent) return null;
        return hierarchy.tierOf(app.metadataCache.getFileCache(parent)?.frontmatter, categories);
    };
    const allowedUnder = (parentName) => parentName
        ? hierarchy.allowedChildTypes(categories, tierUnder(parentName))
        : categories;

    // The note you clicked from is the parent you almost always want.
    const activeIsLocation = preferActiveAsParent
        && active
        && form.typeOf(active) === "location"
        && byName.has(active.basename);

    const NO_DIMENSION = "— None (top level) —";
    const dimensions = form.dimensionsIn(campaignRoot);
    const scope = form.dimensionScope(dimensions);
    // Launched from inside a dimension, that is the dimension meant — otherwise the
    // campaign world, which dimensionField falls back to on its own.
    const activeDimension = form.dimensionOf(dimensions, active);

    // Inside a dimension: the dimension leads its own subtree. Outside one: every
    // location, with the usual skip-to-top-level row.
    const parentOptions = (dimension) => {
        const files = scope(dimension, candidates);
        if (!dimension) return [[form.SKIP, ""], ...files.map(f => [f.basename, f.basename])];
        return [
            [`${dimension} (top of this dimension)`, dimension],
            ...files.filter(f => f.basename !== dimension).map(f => [f.basename, f.basename]),
        ];
    };

    const dimensionRow = form.dimensionField({
        root: campaignRoot,
        value: activeDimension,
        noneLabel: NO_DIMENSION,
        description: "Narrows the parent list to this dimension. Pick None to file outside them all — the only way to add a new dimension.",
        emptyHint: "No dimension in this campaign yet — every location is offered as a parent.",
    });

    const answers = await form.formPrompt({
        title: "New location",
        saveLabel: "Create location",
        fields: [
            {
                key: "name",
                label: "Location name",
                required: true,
                placeholder: "Silverbrook",
            },
            dimensionRow,
            {
                key: "parent",
                label: "Parent location",
                type: "select",
                value: activeIsLocation ? active.basename : "",
                disabled: !candidates.length,
                options: candidates.length ? parentOptions(dimensionRow.value ?? "") : [],
                dependsOn: "dimension",
                optionsFor: (dimension) => (candidates.length ? parentOptions(dimension) : []),
                describe: (dimension) => {
                    if (!candidates.length) return "No location in this campaign yet — this one starts the tree.";
                    if (activeIsLocation) return "Defaults to the note you are in.";
                    return dimension
                        ? `Locations inside ${dimension}.`
                        : "Skip to file it at the top level of this campaign's world.";
                },
            },
            {
                key: "location_type",
                label: "Location type",
                type: "select",
                dependsOn: "parent",
                optionsFor: (parent) => allowedUnder(parent).map(c => [c.label, c.label]),
                describe: (parent) => allowedUnder(parent).length
                    ? (parent ? `Only types that can nest inside ${parent}.` : "")
                    : `No location type can nest under ${parent}.`,
            },
        ],
    });
    if (!answers) cancel();

    const picked = categories.find(c => c.label === answers.location_type);
    if (!picked) {
        notify(`No location type can nest under ${answers.parent}.`);
        cancel();
    }

    const parent = byName.get(answers.parent) || null;
    const name = answers.name;

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
    variables.locations = form.yamlList(parent ? parent.basename : null);

    // Locations are folder notes ({Name}/{Name}.md) so their children can nest
    // inside them — hence the trailing "/{name}".
    const baseFolder = parent
        ? hierarchy.folderUnderParent(parent.parent?.path || campaignRoot, picked)
        : hierarchy.folderAtCampaignRoot(campaignRoot, picked);
    variables.folderName = `${baseFolder}/${name}`;
};
