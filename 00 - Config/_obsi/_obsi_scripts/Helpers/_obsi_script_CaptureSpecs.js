// Single source of truth for the four at-the-table quick captures — the format
// the wizard WRITES and the promote parsers READ. One file so the two can never
// drift apart: add a line here and both sides pick it up.
//
// Capture format (flat on purpose — no callout wrapper, it is typed live and it
// has to stay trivially parseable):
//
//   ---
//   **NPC:** Elowen Marsh
//   **Race:** Fey
//   **Where:** Amberhall
//   ...
//   - [ ] Promote to World NPC
//   ```dataviewjs
//   await dv.view(".../action_bar", { actions: [["Promote to World NPC", …]] });
//   ```
//
//   ---
//
// Rules that both sides rely on:
//   * one `**Label:** value` line per field, in `fields` order
//   * a skipped field keeps its `{hint}` — parsers treat any `{…}` value as empty
//   * note-linked fields hold PLAIN NAMES ("Amberhall", or "A, B" when multiple);
//     the parsers turn them into "[[wikilinks]]" once they resolve against the vault
//   * `- [ ] Promote to World {Type}` is what finds a capture — never reword it
//
// Usage:
//   const specs = tp.user._obsi_script_CaptureSpecs();          // Templater
//   const specs = require(<abs path>)();                        // QuickAdd
//   specs.get("npc") / specs.render(spec, values) / specs.parse(spec, blockText)

// Mirrors the `gender` ValuesList in .obsidian/plugins/metadata-menu/data.json.
const GENDERS = ["Male", "Female", "Non-binary", "Unknown", "Other"];

// input kinds:
//   text       free text (form row)
//   select     dropdown of fixed values
//   iconType   dropdown of IconRegistry(domain) labels — the same list the
//              matching "Macro - Add …" wizard offers, so the value promotes as-is
//   noteSelect dropdown of existing notes of the given frontmatter types
//   noteMulti  multi-select of existing notes (comma-separated in the capture)
//   hint       never prompted — the line is written with its {hint} for later
const SPECS = {
    npc: {
        type: "NPC",
        promoteMacro: "Macro - Promote NPC Capture",
        fields: [
            { label: "Race", key: "race", input: "iconType", iconDomain: "npc",
              hint: "{creature type – Humanoid, Fey, Undead, Beast, Fiend…}" },
            { label: "Sub-race", key: "subRace", input: "text",
              hint: "{player race – Wood Elf, Dwarf, Tiefling…}" },
            { label: "Gender", key: "gender", input: "select", options: GENDERS, hint: "" },
            { label: "Age", key: "age", input: "text", hint: "" },
            { label: "Occupation", key: "occupation", input: "text", hint: "{role in the world}" },
            { label: "Where", key: "where", input: "noteSelect",
              noteTypes: ["location", "establishment"], hint: "{where they were met}" },
            { label: "Factions", key: "factions", input: "noteMulti",
              noteTypes: ["faction"], hint: "{group(s) they belong to}" },
            { label: "Vibe", key: "vibe", input: "text", hint: "{3 adjectives – shifty, proud, eccentric}" },
            { label: "Looks", key: "looks", input: "text", hint: "{1-2 key visual details}" },
            { label: "Goal", key: "goal", input: "text", hint: "{what they want right now}" },
        ],
    },

    faction: {
        type: "Faction",
        promoteMacro: "Macro - Promote Faction Capture",
        fields: [
            { label: "Type", key: "faction_type", input: "iconType", iconDomain: "faction",
              hint: "{Religion / Citizenship / Gang / Organisation / Deity_Group}" },
            { label: "Parent faction", key: "parent_faction", input: "noteSelect",
              noteTypes: ["faction"], hint: "{bigger faction this one belongs to}" },
            { label: "Leader", key: "leader", input: "noteSelect", noteTypes: ["npc"], hint: "{NPC}" },
            { label: "HQ", key: "hq", input: "noteSelect",
              noteTypes: ["location", "establishment"], hint: "{primary base or location}" },
            { label: "Goal", key: "goal", input: "text", hint: "{primary aim or ideology}" },
            { label: "Vibe", key: "vibe", input: "text", hint: "{3 adjectives – secretive, militant, decadent}" },
            { label: "Emblem", key: "emblem", input: "hint", hint: "{symbol, insignia, colors}" },
            { label: "PC Connection", key: "pc_connection", input: "hint",
              hint: "{why they matter to the party}" },
        ],
    },

    location: {
        type: "Location",
        promoteMacro: "Macro - Promote Location Capture",
        fields: [
            { label: "Parent", key: "parent", input: "noteSelect", noteTypes: ["location"],
              hint: "{containing location – the city's country, the region's continent…}" },
            { label: "Type", key: "location_type", input: "iconType", iconDomain: "location",
              hint: "{Dimension / Continent / Region / Country / State / City / Island / Forest / Water / Mountain / Dungeon}" },
            { label: "Leader", key: "leader", input: "noteSelect", noteTypes: ["npc", "faction"],
              hint: "{ruler, authority, or dominant faction}" },
            { label: "Terrain", key: "terrain", input: "text", hint: "{coastal, volcanic, marsh…}" },
            { label: "Vibe", key: "vibe", input: "text", hint: "{3 adjectives – cramped, prosperous, haunted}" },
            { label: "Known for", key: "known_for", input: "text", hint: "{landmarks, trade, dangers}" },
            { label: "PC Connection", key: "pc_connection", input: "hint",
              hint: "{quest hook, ally, base of operations}" },
        ],
    },

    establishment: {
        type: "Establishment",
        promoteMacro: "Macro - Promote Establishment Capture",
        fields: [
            { label: "Type", key: "establishment_type", input: "iconType", iconDomain: "establishment",
              hint: "{Commerce & Trade / Taverns & Inns / Knowledge & Services / Religious & Spiritual / Government & Law / Travel & Industry / Shady & Underworld / Other}" },
            { label: "Where", key: "where", input: "noteSelect", noteTypes: ["location"],
              hint: "{location it sits in}" },
            { label: "Owner/Contact", key: "owner", input: "noteSelect", noteTypes: ["npc"], hint: "{NPC}" },
            { label: "Known for", key: "known_for", input: "text",
              hint: "{food, service, shady dealings, rare goods…}" },
            { label: "Vibe", key: "vibe", input: "text", hint: "{3 adjectives – cozy, rowdy, eerie}" },
            { label: "PC Connection", key: "pc_connection", input: "hint",
              hint: "{quest hook, ally, safehouse, supplier}" },
        ],
    },
};

const box = (type) => `- [ ] Promote to World ${type}`;

// The promote button renders through the shared action_bar view rather than a
// Buttons-plugin ```button fence — that plugin was the last thing keeping the
// dependency alive, and action_bar already replaced the fences everywhere else.
// MarkCapturePromoted strips this block once the capture is promoted.
const ACTION_BAR = "00 - Config/_obsi/_obsi_views/action_bar";
const PROMOTE_COLOR = "#3a5f8a";

// A value still wearing its {hint} means "not filled in".
const isHint = (value) => {
    const v = String(value ?? "").trim();
    return v === "" || (v.startsWith("{") && v.endsWith("}"));
};

// Capture text for a filled-in spec. `values` is keyed by field.key; anything
// missing falls back to the field's hint.
const render = (spec, name, values = {}) => {
    const lines = spec.fields.map((field) => {
        const raw = values[field.key];
        const value = Array.isArray(raw) ? raw.join(", ") : raw;
        return `**${field.label}:** ${isHint(value) ? field.hint : String(value).trim()}`;
    });

    return [
        "---",
        [
            `**${spec.type}:** ${String(name).trim()}`,
            ...lines,
            "",
            box(spec.type),
            "```dataviewjs",
            `await dv.view("${ACTION_BAR}", { actions: [["Promote to World ${spec.type}", `
                + `"${spec.promoteMacro}", "${PROMOTE_COLOR}"]], compact: true });`,
            "```",
        ].join("\n"),
        "---",
    ].join("\n\n");
};

// Reads one capture block back. Returns { name, values } with every unfilled
// field as "" — never a {hint} — so callers can test truthiness. Tolerates the
// legacy callout captures (`> **Race:** …`) by stripping blockquote markers.
const parse = (spec, blockText) => {
    const flat = String(blockText).replace(/^[ \t]*>+[ \t]?/gm, "");
    const found = {};
    for (const line of flat.split("\n")) {
        const m = line.match(/^\s*\*\*(.+?):\*\*\s*(.*?)\s*$/);
        if (m) found[m[1].trim().toLowerCase()] = m[2];
    }

    const clean = (value) => (isHint(value) ? "" : String(value).trim());
    const values = {};
    for (const field of spec.fields) {
        const raw = found[field.label.toLowerCase()];
        values[field.key] = field.input === "noteMulti"
            ? clean(raw).split(",").map(s => s.trim()).filter(Boolean)
            : clean(raw);
    }

    return { name: clean(found[spec.type.toLowerCase()]), values };
};

module.exports = () => ({
    GENDERS,
    domains: Object.keys(SPECS),
    get: (domain) => {
        const spec = SPECS[String(domain).toLowerCase()];
        if (!spec) {
            throw new Error(
                `CaptureSpecs: unknown domain "${domain}" (expected: ${Object.keys(SPECS).join(", ")})`
            );
        }
        return spec;
    },
    box,
    isHint,
    render,
    parse,
});
