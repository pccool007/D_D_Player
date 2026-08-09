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
 * STYLING lives in .obsidian/snippets/pc-card.css, not here — this is one of the
 * views that emits classes instead of inline styles, so the card look is
 * editable in one file. The markup contract is documented at the top of that
 * snippet; the palette is keyed off three data attributes:
 *   data-pc-class      → --pc-accent   (class colour)
 *   data-pc-condition  → --pc-cond     (badge colour)
 *   data-pc-tint       → --pc-tint-a/b (placeholder portrait gradient)
 * Adding a class colour is a line of CSS, not a line of JS. Both pc-card.css and
 * dnd-tokens.css (which it reads its borders and status colours from) have to
 * stay enabled in appearance.json, or these cards render unstyled.
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

// How many portrait tints extra.css defines — the index cycles through them so a
// roster of art-less characters isn't six identical grey rectangles.
const TINTS = 6;

const el = (parent, tag, cls, text) => parent.createEl(tag, { cls: cls ?? undefined, text: text ?? undefined });
const num = (v, d = 0) => { const n = Number(v); return isNaN(n) ? d : n; };
const pv = (x) => (x == null || x === "") ? "—" : String(x);
const arr = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(Boolean);
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();

// Frontmatter is free text ("Presume Dead", "Rogue") and a data attribute has to
// match a CSS selector exactly, so both go through the same slug.
const slug = (v) => String(v ?? "").trim().toLowerCase().replace(/\s+/g, "-");

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
	const grid = el(dv.container, "div", "pc-roster");

	let idx = -1;
	for (const p of pcs) {
		idx++;
		const name = p.name ?? p.file.name;
		// A multiclass PC lists several; the first one colours the card.
		const klassName = arr(p.class)[0] ?? null;
		const klass = pv(klassName);
		const race = p.subRace ? `${p.race ?? "?"} · ${p.subRace}` : pv(p.race);
		const age = (p.age == null || p.age === "") ? "—" : `${num(p.age)} ${num(p.age) === 1 ? "yr" : "yrs"}`;
		const groups = arr(p.factions).map(nameOf).filter(g => g.toLowerCase() !== "none");

		const card = el(grid, "div", "pc-rcard pc-themed");
		card.dataset.pcClass = slug(nameOf(klassName ?? ""));
		card.dataset.pcCondition = slug(p.condition ?? "alive");
		card.dataset.pcTint = String(idx % TINTS);

		// ---- portrait ----
		const port = el(card, "div", "pc-rcard-portrait");
		const imgField = p.img ?? p.player_img;
		let painted = false;
		if (imgField) {
			const link = Array.isArray(imgField) ? imgField[0] : imgField;
			const raw = (typeof link === "object" && link.path) ? link.path
				: String(link).replace(/^\[\[|\]\]$/g, "").split("|")[0];
			const f = app.vault.getAbstractFileByPath(raw) ?? app.metadataCache.getFirstLinkpathDest(raw, p.file.path);
			if (f) {
				el(port, "img", "pc-rcard-img").setAttribute("src", app.vault.getResourcePath(f));
				painted = true;
			}
		}
		if (!painted) {
			el(port, "div", "pc-rcard-initial", (String(name).trim()[0] || "?").toUpperCase());
		}
		el(port, "div", "pc-rcard-scrim");
		el(port, "div", "pc-badge", String(p.condition ?? "Alive"));

		// ---- body ----
		const body = el(card, "div", "pc-rcard-body");
		const title = el(body, "div", "pc-rcard-title");
		title.createEl("a", { cls: "internal-link pc-rcard-name", text: name,
			attr: { href: p.file.path, "data-href": p.file.path } });
		if (p.level != null && p.level !== "") {
			el(title, "span", "pc-rcard-level", `Lvl ${num(p.level)}`);
		}
		el(body, "div", "pc-rcard-class", klass);
		el(body, "div", "pc-rcard-race", race);

		// stat strip — only when the sheet actually carries any of them
		if ([p.hp, p.ac, p.level].some(v => v != null && v !== "")) {
			const strip = el(body, "div", "pc-stats is-compact");
			const tiles = [
				["hp", "HP", pv(p.hp)],
				["ac", "AC", pv(p.ac)],
				["level", "LVL", p.level == null || p.level === "" ? "—" : String(num(p.level))],
			];
			for (const [key, label, value] of tiles) {
				const t = el(strip, "div", `pc-stat is-${key}`);
				el(t, "div", "pc-stat-value", value);
				el(t, "div", "pc-stat-label", label);
			}
		}

		const meta = el(body, "div", "pc-rcard-meta");
		if (p.player) el(meta, "div", null, `Played by ${nameOf(p.player)}`);
		if (age !== "—") el(meta, "div", null, `Age ${age}`);
		if (groups.length) el(meta, "div", null, groups.join(" · "));
		if (showCampaign) {
			const camp = (p.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
			if (camp) el(meta, "div", null, camp.replace(/_/g, " "));
		}
	}
}
