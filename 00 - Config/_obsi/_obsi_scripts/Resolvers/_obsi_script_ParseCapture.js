// Shared promote parser — reads a quick capture out of the active session note and
// sets every variable the matching Template_*.md needs, so the promote macro can
// hand it straight to QuickAdd's template step.
//
// Not a QuickAdd step itself: the four thin wrappers in this folder are
// (_obsi_script_ParseNPCCapture.js and friends), because a QuickAdd UserScript
// step takes no arguments.
//
//   module.exports = (params) => require(<this file>)("npc", params);
//
// Runs AFTER _obsi_script_SetParamsInCapGetCampaignFolder, so variables.folderName
// already holds "01 - Campaigns/{campaign}".
//
// Captures are found by their `- [ ] Promote to World {Type}` line (see
// _obsi_script_CaptureSpecs.js). Several pending captures of the same type in one
// note → a suggester picks which. Nothing pending → the macro is cancelled.
//
// It also records where the capture came from (capture_source_path /
// capture_block_index) so _obsi_script_MarkCapturePromoted can tick the box once
// the note exists.
const CAPTURE_SPECS = "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_CaptureSpecs.js";
const ICON_REGISTRY = "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js";
const LOCATION_HIERARCHY = "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_LocationHierarchy.js";

module.exports = async (domain, params) => {
    const { app, quickAddApi, variables } = params;
    const path = require("path");
    const helper = (rel) => require(path.join(app.vault.adapter.basePath, rel));

    const specs = helper(CAPTURE_SPECS)();
    const iconRegistry = helper(ICON_REGISTRY);
    const spec = specs.get(domain);

    const cancel = (message) => {
        if (message) new Notice(message);
        variables.cancelled = true;
        return false;
    };

    const source = app.workspace.getActiveFile();
    if (!source) return cancel("Promote: open the session note holding the capture first.");

    const campaignRoot = variables.folderName;
    const content = await app.vault.read(source);
    const blocks = content.split(/\n---\n/);
    const pending = blocks
        .map((text, index) => ({ text, index }))
        .filter(b => b.text.includes(specs.box(spec.type)));

    if (!pending.length) {
        return cancel(`Promote: no unpromoted ${spec.type} capture in ${source.basename}.`);
    }

    let chosen = pending[0];
    if (pending.length > 1) {
        const named = pending.map(b => ({ ...b, parsed: specs.parse(spec, b.text) }));
        const picked = await quickAddApi.suggester(
            named.map(b => b.parsed.name || "(unnamed)"),
            named,
            `Which ${spec.type} capture?`
        );
        if (!picked) return cancel();
        chosen = picked;
    }

    const { name, values } = specs.parse(spec, chosen.text);
    if (!name) return cancel(`Promote: that ${spec.type} capture has no name filled in.`);

    // Frontmatter helpers -------------------------------------------------------
    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
    const noteNamed = (value, types) => {
        const wanted = String(value || "").trim().toLowerCase();
        if (!wanted) return null;
        return app.vault.getMarkdownFiles().find(f =>
            f.basename.toLowerCase() === wanted
            && (!campaignRoot || f.path.startsWith(campaignRoot + "/"))
            && types.includes(typeOf(f))) || null;
    };
    const yamlList = (names) => (names || [])
        .map(n => `\n  - "[[${n}]]"`)
        .join("");
    // Picks the registry entry for a captured type, falling back to the first
    // option so a skipped Type line still yields a valid icon.
    const styleFor = (iconDomain, value, fallback) => {
        const table = iconRegistry(iconDomain);
        if (Array.isArray(table)) {
            return table.find(t => t.label.toLowerCase() === String(value).toLowerCase())
                || table.find(t => t.label === fallback)
                || table[0];
        }
        const key = Object.keys(table)
            .find(k => k.toLowerCase() === String(value).toLowerCase()) || fallback;
        return { label: key, ...table[key] };
    };

    // `description` lands inside quotes in the templates' YAML, so a captured
    // double quote has to go.
    const plain = (value) => String(value || "").replace(/"/g, "'").trim();

    variables.name = name;
    variables.fileName = name;
    variables.capture_source_path = source.path;
    variables.capture_block_index = String(chosen.index);
    variables.capture_type = spec.type;
    // Every capture line has a home in the promoted note's frontmatter; the ones
    // with no field of their own (an NPC's Goal, a PC Connection) stay readable in
    // the session note, which keeps the capture as the record of the moment.
    variables.word_description = plain(values.vibe);
    variables.description = "";

    if (domain === "npc") {
        const style = styleFor("npc", values.race, "Unknown");
        variables.race = style.label;
        variables.icon = style.icon;
        variables.iconColor = style.iconColor;
        // The race subfolder rides in fileName — the macro's template step writes
        // to {{VALUE:folderName}}/World/NPC, exactly like Macro - Add NPC.
        variables.fileName = `${style.label}/${name}`;
        variables.gender = values.gender || "";
        variables.subRace = plain(values.subRace);
        variables.age = plain(values.age);
        variables.occupation = plain(values.occupation);
        variables.description = plain(values.looks);

        const where = noteNamed(values.where, ["location", "establishment"]);
        variables.locations = where ? `\n  - "[[${where.basename}]]"` : "";
        variables.first_location = where ? `"[[${where.basename}]]"` : "";
        variables.last_seen = where ? `"[[${where.basename}]]"` : "";

        const factions = (values.factions || [])
            .map(n => noteNamed(n, ["faction"]))
            .filter(Boolean)
            .map(f => f.basename);
        variables.factions = yamlList(factions);
        return true;
    }

    if (domain === "faction") {
        const style = styleFor("faction", values.faction_type, "Organisation");
        variables.faction_type = style.label;
        variables.icon = style.icon;
        variables.iconColor = style.iconColor;

        const leader = noteNamed(values.leader, ["npc"]);
        variables.leader = leader ? `"[[${leader.basename}]]"` : plain(values.leader);
        const hq = noteNamed(values.hq, ["location", "establishment"]);
        variables.locations = hq ? `\n  - "[[${hq.basename}]]"` : "";
        variables.goal = plain(values.goal);
        variables.emblem_description = plain(values.emblem);

        const factionsRoot = `${campaignRoot}/World/Factions`;
        const parent = noteNamed(values.parent_faction, ["faction"]);
        variables.parent_faction = parent ? `\n  - "[[${parent.basename}]]"` : "";
        // Same layout Macro - Add Faction produces.
        variables.folderName = parent
            ? `${factionsRoot}/sub-factions/${parent.basename}`
            : factionsRoot;
        return true;
    }

    if (domain === "location") {
        const hierarchy = helper(LOCATION_HIERARCHY)();
        const categories = iconRegistry("location");
        const parent = noteNamed(values.parent, ["location"]);

        const parentTier = parent
            ? hierarchy.tierOf(app.metadataCache.getFileCache(parent)?.frontmatter, categories)
            : null;
        const allowed = parent ? hierarchy.allowedChildTypes(categories, parentTier) : categories;
        let picked = allowed.find(c => c.label.toLowerCase() === String(values.location_type).toLowerCase());

        if (!picked) {
            // Either the Type line was skipped or the captured type cannot nest
            // under that parent — ask, offering only what is legal here.
            const chosenType = await quickAddApi.suggester(
                allowed.map(c => c.label), allowed,
                parent ? `Location type? (inside ${parent.basename})` : "Location type?"
            );
            if (!chosenType) return cancel();
            picked = chosenType;
        }

        const ruler = noteNamed(values.leader, ["npc", "faction"]);
        variables.leader = ruler ? `"[[${ruler.basename}]]"` : plain(values.leader);
        variables.terrain = plain(values.terrain);
        variables.description = plain(values.known_for);

        variables.location_type = picked.label;
        variables.icon = picked.icon;
        variables.location_tier_level = picked.tier === null ? "" : String(picked.tier);
        variables.locations = parent ? `\n  - "[[${parent.basename}]]"` : "";

        // Locations are folder notes: {folder}/{name}/{name}.md
        const baseFolder = parent
            ? hierarchy.folderUnderParent(parent.parent?.path || campaignRoot, picked)
            : hierarchy.folderAtCampaignRoot(campaignRoot, picked);
        variables.folderName = `${baseFolder}/${name}`;
        return true;
    }

    if (domain === "establishment") {
        const style = styleFor("establishment", values.establishment_type, "Other");
        variables.establishment_type = style.label;
        variables.icon = style.icon;

        const owner = noteNamed(values.owner, ["npc"]);
        variables.owner = owner ? `"[[${owner.basename}]]"` : plain(values.owner);
        variables.description = plain(values.known_for);

        const where = noteNamed(values.where, ["location"]);
        variables.locations = where ? `\n  - "[[${where.basename}]]"` : "";
        // Establishments live inside their location's folder when that location is
        // a folder note, exactly like Macro - Add Establishment.
        const isFolderNote = where && where.parent?.name === where.basename;
        variables.folderName = isFolderNote
            ? `${where.parent.path}/Establishments`
            : `${campaignRoot}/World/Establishments`;
        return true;
    }

    return cancel(`Promote: no parser for "${domain}".`);
};
