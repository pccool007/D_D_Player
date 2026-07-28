/* pc_card — the BIO / INFO / PARTY sidebar panels for a single PC note.
 *
 * The single-character twin of pc_roster: same panel chrome as manager_aside, but
 * driven by the PC note it sits on. Styling is inline, so it needs no CSS
 * snippet and no `cssclasses`.
 *
 * Usage (dataviewjs), inside the PC note's [!infobox] callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/pc_card");
 *   > ```
 *
 * Options:
 *   page  : a Dataview page to render instead of the current note.
 *   stats : false to drop the Level/HP/AC tile row.
 *
 * Stat tiles only render when the sheet carries any of level / hp / ac, so this
 * works on a half-filled character too.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
const p = input?.page ?? dv.current();

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};
const arr = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();
// The PC template seeds several list fields with a literal "None" — treat that as empty.
const meaningful = (v) => arr(v).map(nameOf).filter(x => x && x.toLowerCase() !== "none");
const num = (v, d = 0) => { const n = Number(v); return isNaN(n) ? d : n; };

const wrap = el(dv.container, "div", "display:flex;flex-direction:column;gap:.7rem;margin:.2rem 0 .1rem;");
const panel = (title) => {
	const g = el(wrap, "div", "border:1px solid var(--background-modifier-border);border-radius:12px;background:var(--background-secondary);overflow:hidden;");
	el(g, "div", "text-align:center;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);font-weight:600;padding:.5rem;border-bottom:1px solid var(--background-modifier-border);", title);
	return el(g, "div", "padding:.15rem .8rem .4rem;");
};

const ROW = "display:flex;justify-content:space-between;align-items:baseline;gap:.8rem;padding:.35rem 0;border-bottom:1px solid color-mix(in srgb,var(--background-modifier-border) 55%,transparent);font-size:.86rem;";
const VAL = "text-align:right;font-weight:500;color:var(--text-normal);";
const MUTED = "text-align:right;font-weight:400;color:var(--text-faint);";

const textRow = (body, key, value) => {
	const r = el(body, "div", ROW);
	el(r, "span", "color:var(--text-muted);", key);
	const vals = meaningful(value);
	if (!vals.length) { el(r, "span", MUTED, "—"); return; }
	el(r, "span", VAL, vals.join(" · "));
};
const linkRow = (body, key, value) => {
	const r = el(body, "div", ROW);
	el(r, "span", "color:var(--text-muted);", key);
	const vals = arr(value).filter(x => nameOf(x).toLowerCase() !== "none");
	if (!vals.length) { el(r, "span", MUTED, "—"); return; }
	const v = el(r, "span", VAL);
	vals.forEach((x, i) => {
		if (i) v.appendText(", ");
		const target = (x && typeof x === "object" && x.path) ? x.path : nameOf(x);
		v.createEl("a", { text: nameOf(x), attr: { href: target, "data-href": target, class: "internal-link", style: "text-decoration:none;" } });
	});
};

// ---- STATS ----
if (input?.stats !== false && [p.level, p.hp, p.ac].some(v => v != null && v !== "")) {
	const stats = panel("Stats");
	const grid = el(stats, "div", "display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;padding:.45rem 0 .5rem;");
	const tiles = [
		["Level", p.level == null || p.level === "" ? "—" : String(num(p.level)), "#e0b84a"],
		["HP", p.hp == null || p.hp === "" ? "—" : String(p.hp), "#cc5a4a"],
		["AC", p.ac == null || p.ac === "" ? "—" : String(p.ac), "#6aa9f0"],
	];
	for (const [label, value, color] of tiles) {
		const tile = el(grid, "div", `padding:.35rem .2rem;text-align:center;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-top:2px solid ${color};border-radius:6px;`);
		el(tile, "div", "font-size:1.05rem;font-weight:700;color:var(--text-normal);line-height:1.1;", value);
		el(tile, "div", "font-size:.55rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-top:1px;", label);
	}
}

// ---- BIO ----
const bio = panel("Bio");
textRow(bio, "Class", p.class);
textRow(bio, "Race", p.subRace ? `${p.race ?? "?"} · ${p.subRace}` : p.race);
textRow(bio, "Gender", p.gender);
textRow(bio, "Age", (p.age == null || p.age === "") ? null : `${num(p.age)} yrs`);
textRow(bio, "Condition", p.condition ?? "Alive");

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
