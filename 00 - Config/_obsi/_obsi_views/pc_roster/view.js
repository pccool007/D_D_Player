/* pc_roster — hero-card grid of player characters. Two modes, one renderer.
 *
 * FOLDER MODE (default) — queries a campaign's PC folder for the living roster.
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", { campaign: true });
 *   ```
 *
 * FRONTMATTER MODE — reads a YAML list of PC wikilinks from the note itself, so
 * a note can render only its own selected players.
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", { field: "players" });
 *   ```
 *
 * VAULT MODE — every PC across every campaign, for Dashboard.md.
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", { folder: "01 - Campaigns" });
 *   ```
 *
 * Options:
 *   campaign  : true → folder mode against this note's folder + "/PC".
 *   folder    : explicit folder; implies folder mode.
 *   condition : folder mode only — `condition` frontmatter to keep, compared
 *               case-insensitively (default "alive"; pass null for everyone).
 *   where     : extra predicate a PC page must satisfy, both modes.
 *   field     : frontmatter mode only — key holding the wikilinks.
 *   showCampaign : true → add a Campaign row (useful in vault mode).
 *   empty     : markdown rendered when nothing matches.
 *
 * Stat rows (Level / HP / AC) are optional: a PC note that doesn't carry them
 * simply renders "—", so this works whether or not the sheet is filled in.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
const i = input ?? {};
const field = i.field ?? null;
const folderMode = i.folder != null || i.campaign === true || field == null;
const folder = i.folder ?? `${dv.current().file.folder}/PC`;
const condition = i.condition === undefined ? "alive" : i.condition;
const where = typeof i.where === "function" ? i.where : () => true;
const showCampaign = i.showCampaign === true;
const empty = i.empty ?? "*No player characters yet.*";

const CLASS_COLORS = {
	Rogue: "#c9a24b", Wizard: "#6aa9f0", Cleric: "#e6c05a", Sorcerer: "#e0728f",
	Fighter: "#d4744a", Artificer: "#4fb0a0", Barbarian: "#cc5a4a",
	Bard: "#c56ad0", Druid: "#5fae5f", Monk: "#5ac0d0", Paladin: "#e0b84a",
	Ranger: "#5fae7a", Warlock: "#a06ae0",
};
const PBG = ["135deg,#3a3f4b,#262a33", "135deg,#4a3f3a,#2e2622", "135deg,#3a4a44,#232e2a",
	"135deg,#453a4a,#2a2230", "135deg,#4a3a42,#2e2228", "135deg,#3f4438,#262a20"];

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};
const num = (v, d = 0) => { const n = Number(v); return isNaN(n) ? d : n; };
const pv = (x) => (x == null || x === "") ? "—" : String(x);
const arr = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(Boolean);
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();

const condStyle = (cond) => {
	const c = String(cond ?? "alive").toLowerCase();
	const color = c === "dead" ? "#e05a5a"
		: (c === "missing" || c === "presume dead") ? "#e8923a"
		: "#3fb862";
	return { color, bg: `color-mix(in srgb,${color} 12%,var(--background-secondary))`, border: `color-mix(in srgb,${color} 32%,transparent)` };
};

const isPlayer = (p) => dv.array(p.type).some(t => String(t).toLowerCase() === "player");

// ---- roster: a folder query, or the PC links on this note ----
let pcs;
if (folderMode) {
	pcs = dv.pages(`"${folder}"`)
		.where(p => isPlayer(p)
			&& (condition == null
				|| String(p.condition ?? "alive").toLowerCase() === String(condition).toLowerCase()))
		.array();
} else {
	pcs = arr(dv.current()[field]).map(l => dv.page(l.path ?? l)).filter(Boolean);
}
pcs = pcs.filter(where);
pcs = pcs.sort((a, b) => String(a.name ?? a.file.name).toLowerCase()
	.localeCompare(String(b.name ?? b.file.name).toLowerCase()));

if (!pcs.length) {
	dv.paragraph(empty);
} else {
	const grid = dv.container.createEl("div", { attr: { style:
		"display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;" } });

	let idx = -1;
	for (const p of pcs) {
		idx++;
		const name = p.name ?? p.file.name;
		const klassName = Array.isArray(p.class) ? p.class[0] : p.class;
		const klass = pv(klassName);
		const classColor = CLASS_COLORS[klassName] ?? "#9aa9c0";
		const race = p.subRace ? `${p.race ?? "?"} · ${p.subRace}` : pv(p.race);
		const age = (p.age == null || p.age === "") ? "—" : `${num(p.age)} ${num(p.age) === 1 ? "yr" : "yrs"}`;
		const groups = arr(p.factions).map(nameOf).filter(g => g.toLowerCase() !== "none");
		const cs = condStyle(p.condition);

		const card = el(grid, "div", "position:relative;border:1px solid var(--background-modifier-border);border-radius:12px;background:var(--background-primary);overflow:hidden;display:flex;flex-direction:column;");

		// ---- portrait ----
		const port = el(card, "div", `position:relative;aspect-ratio:4/5;background:linear-gradient(${PBG[idx % PBG.length]});overflow:hidden;`);
		const imgField = p.img ?? p.player_img;
		let painted = false;
		if (imgField) {
			const link = Array.isArray(imgField) ? imgField[0] : imgField;
			const raw = (typeof link === "object" && link.path) ? link.path
				: String(link).replace(/^\[\[|\]\]$/g, "").split("|")[0];
			const f = app.vault.getAbstractFileByPath(raw) ?? app.metadataCache.getFirstLinkpathDest(raw, p.file.path);
			if (f) {
				el(port, "img", "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;")
					.setAttribute("src", app.vault.getResourcePath(f));
				painted = true;
			}
		}
		if (!painted) {
			el(port, "div", "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:700;color:color-mix(in srgb,var(--text-muted) 40%,transparent);",
				(String(name).trim()[0] || "?").toUpperCase());
		}
		el(port, "div", "position:absolute;top:0;left:0;right:0;height:64px;background:linear-gradient(180deg,rgba(0,0,0,.55),transparent);");

		// condition badge, top-right of the portrait
		el(port, "div", `position:absolute;top:8px;right:8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:.15em .5em;border-radius:999px;color:${cs.color};background:${cs.bg};border:1px solid ${cs.border};`,
			String(p.condition ?? "Alive"));

		// ---- body ----
		const body = el(card, "div", "padding:.6rem .75rem .7rem;display:flex;flex-direction:column;gap:.25rem;");
		const title = el(body, "div", "display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;");
		title.createEl("a", { text: name, attr: { href: p.file.path, "data-href": p.file.path, class: "internal-link",
			style: "font-weight:700;font-size:1rem;text-decoration:none;" } });
		if (p.level != null && p.level !== "") {
			el(title, "span", "font-size:.72rem;font-weight:700;color:var(--text-muted);", `Lvl ${num(p.level)}`);
		}
		el(body, "div", `font-size:.8rem;font-weight:600;color:${classColor};`, klass);
		el(body, "div", "font-size:.75rem;color:var(--text-muted);", race);

		// stat strip — only when the sheet actually carries any of them
		if ([p.hp, p.ac, p.level].some(v => v != null && v !== "")) {
			const strip = el(body, "div", "display:grid;grid-template-columns:repeat(3,1fr);gap:.25rem;margin-top:.35rem;");
			for (const [label, value] of [["HP", pv(p.hp)], ["AC", pv(p.ac)], ["LVL", p.level == null || p.level === "" ? "—" : String(num(p.level))]]) {
				const t = el(strip, "div", "padding:.2rem;text-align:center;background:var(--background-secondary);border-radius:5px;");
				el(t, "div", "font-size:.85rem;font-weight:700;line-height:1.1;", value);
				el(t, "div", "font-size:.5rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);", label);
			}
		}

		const meta = el(body, "div", "margin-top:.35rem;display:flex;flex-direction:column;gap:.1rem;font-size:.72rem;color:var(--text-muted);");
		if (p.player) el(meta, "div", null, `Played by ${nameOf(p.player)}`);
		if (age !== "—") el(meta, "div", null, `Age ${age}`);
		if (groups.length) el(meta, "div", null, groups.join(" · "));
		if (showCampaign) {
			const camp = (p.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
			if (camp) el(meta, "div", null, camp.replace(/_/g, " "));
		}
	}
}
