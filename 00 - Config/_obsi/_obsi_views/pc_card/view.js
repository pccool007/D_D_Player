/* pc_card — the BIO / INFO / PARTY sidebar panels for a single PC note.
 *
 * The single-character twin of pc_roster: the panel frame still comes from the
 * shared `panels` view, so a PC's infobox matches an NPC's. What is specific to
 * a PC — the Level/HP/AC tiles, the key/value rows, the Condition colour — is
 * styled by .obsidian/snippets/pc-card.css off the same classes and data
 * attributes pc_roster uses, so both stay in step from one file. That snippet
 * and dnd-tokens.css have to stay enabled in appearance.json.
 *
 * Usage (dataviewjs), inside the PC note's [!infobox] callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/pc_card");
 *   > ```
 *
 * Options:
 *   page  : a Dataview page to render instead of the current note.
 *   stats : false to drop the Level/HP/AC tile row.
 *   container : render into the caller's element instead of dv.container — what
 *           `note_aside` passes so these panels join its stack rather than
 *           landing under it.
 *
 * Stat tiles only render when the sheet carries any of level / hp / ac, so this
 * works on a half-filled character too.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
const p = input?.page ?? dv.current();

// Panel chrome comes from the shared library — this file used to carry a verbatim
// copy of el/wrap/panel/ROW/VAL/MUTED. The rows below stay local: a PC's list
// fields are seeded with a literal "None" that only this view has to strip.
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const P = globalThis.DnDPanels;

const arr = P.list;
const nameOf = P.linkName;
// The PC template seeds several list fields with a literal "None" — treat that as empty.
const meaningful = (v) => arr(v).map(nameOf).filter(x => x && x.toLowerCase() !== "none");
const num = (v, d = 0) => { const n = Number(v); return isNaN(n) ? d : n; };
// Same slug as pc_roster: a data attribute has to match a CSS selector exactly.
const slug = (v) => String(v ?? "").trim().toLowerCase().replace(/\s+/g, "-");

// The rows and tiles below are class-styled (extra.css), so this is a local `el`
// that takes a class rather than the panel library's inline-style one.
const el = (parent, tag, cls, text) => parent.createEl(tag, { cls: cls ?? undefined, text: text ?? undefined });

const wrap = P.stack(input?.container ?? dv.container);
wrap.classList.add("pc-panels", "pc-themed");
wrap.dataset.pcClass = slug(nameOf(arr(p.class)[0] ?? ""));
wrap.dataset.pcCondition = slug(p.condition ?? "alive");

const panel = (title) => P.panel(wrap, title);

// `mod` tags the row for CSS (e.g. "is-condition", which colours the value).
const textRow = (body, key, value, mod) => {
	const r = el(body, "div", `pc-row${mod ? " " + mod : ""}`);
	el(r, "span", "pc-row-key", key);
	const vals = meaningful(value);
	if (!vals.length) { el(r, "span", "pc-row-val is-muted", "—"); return; }
	el(r, "span", "pc-row-val", vals.join(" · "));
};
const linkRow = (body, key, value) => {
	const r = el(body, "div", "pc-row");
	el(r, "span", "pc-row-key", key);
	const vals = arr(value).filter(x => nameOf(x).toLowerCase() !== "none");
	if (!vals.length) { el(r, "span", "pc-row-val is-muted", "—"); return; }
	const v = el(r, "span", "pc-row-val");
	vals.forEach((x, i) => {
		if (i) v.appendText(", ");
		const target = (x && typeof x === "object" && x.path) ? x.path : nameOf(x);
		v.createEl("a", { cls: "internal-link", text: nameOf(x), attr: { href: target, "data-href": target } });
	});
};

// ---- STATS ----
if (input?.stats !== false && [p.level, p.hp, p.ac].some(v => v != null && v !== "")) {
	const stats = panel("Stats");
	const grid = el(stats, "div", "pc-stats");
	const tiles = [
		["level", "Level", p.level == null || p.level === "" ? "—" : String(num(p.level))],
		["hp", "HP", p.hp == null || p.hp === "" ? "—" : String(p.hp)],
		["ac", "AC", p.ac == null || p.ac === "" ? "—" : String(p.ac)],
	];
	for (const [key, label, value] of tiles) {
		const tile = el(grid, "div", `pc-stat is-${key}`);
		el(tile, "div", "pc-stat-value", value);
		el(tile, "div", "pc-stat-label", label);
	}
}

// ---- BIO ----
const bio = panel("Bio");
textRow(bio, "Class", p.class);
textRow(bio, "Race", p.subRace ? `${p.race ?? "?"} · ${p.subRace}` : p.race);
textRow(bio, "Gender", p.gender);
textRow(bio, "Age", (p.age == null || p.age === "") ? null : `${num(p.age)} yrs`);
textRow(bio, "Condition", p.condition ?? "Alive", "is-condition");

// ---- INFO ----
const info = panel("Info");
textRow(info, "Player", p.player);
textRow(info, "Occupation", p.occupation);
textRow(info, "Languages", p.languages);

// ---- PARTY ----
const party = panel("Party");
linkRow(party, "Factions", p.factions);
linkRow(party, "Campaign", p.campaigns);
linkRow(party, "World", p.world);
