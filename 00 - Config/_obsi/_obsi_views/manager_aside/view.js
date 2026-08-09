/* manager_aside — the infobox of a Campaign Manager or the vault Dashboard,
 * rendered as stacked info panels.
 *
 * Self-contained: the styling is inline here, so it needs no CSS snippet and no
 * `cssclasses` on the note. Identity rows, LINKS, STATS tiles and the QuickAdd
 * ACTIONS buttons all wear the same panel look, so nothing floats loose in the
 * infobox.
 *
 * Adapted from the GM vault: this vault has no separate Worlds tree, so the
 * "world" kind is gone — everything a campaign owns lives under the campaign
 * folder, which is what the Stats tiles count.
 *
 * Usage (dataviewjs), inside the note's [!infobox] callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/manager_aside");
 *   > ```
 *
 * Options:
 *   kind         : "campaign" | "vault" (default: inferred from the note's
 *                  `type`). "vault" shows a date-only Info panel and counts its
 *                  Stats across every campaign instead of one campaign folder.
 *   actions      : [[label, QuickAdd choice name, color], …] to replace the
 *                  grouped default with a single "Actions" panel. Pass [] to
 *                  drop the buttons entirely.
 *   actionGroups : [[panel title, actions], …] to replace the default
 *                  Play / World / Items grouping with your own panels.
 *   stats        : false to drop the Stats panel.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
const p = dv.current();
const kind = input?.kind ?? (String(p.type ?? "").toLowerCase() === "campaign" ? "campaign" : "vault");
const isVault = kind === "vault";

// ---- panel scaffolding ----
// These used to be defined here verbatim, and again in pc_card. They now come
// from the shared library — which is also what suppresses the theme's own border
// around .callout-content, so bordered panels don't sit inside a second frame.
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const P = globalThis.DnDPanels;
const { el, list, has, linkName } = P;
const fmtDate = (d) => P.fmtDate(d, dv.luxon);

const wrap = P.stack(dv.container);
const panel = (title) => P.panel(wrap, title);
const textRow = (body, key, value) => P.textRow(body, key, value);

// ---- identity + timeline ----
if (isVault) {
	// Dashboard.md — no frontmatter identity to show, just today's date.
	const info = panel("Info");
	textRow(info, "Date", dv.luxon.DateTime.now().toFormat("yyyy-MM-dd"));
	textRow(info, "Weekday", dv.luxon.DateTime.now().toFormat("cccc"));
} else {
	const camp = panel("Campaign");
	textRow(camp, "System", p.system);
	textRow(camp, "Status", p.status);
	textRow(camp, "Role", p.role);

	const time = panel("Timeline");
	textRow(time, "Created", fmtDate(p.date));
}

// ---- LINKS ----
// `urls` holds markdown links ("[Label](href)"); dndbeyond_url is a bare URL.
// A URL can never contain whitespace, so scrubbing it makes the panel immune to
// the stray space a wrapped paste leaves behind ("https: //host/…").
const cleanHref = (s) => String(s).replace(/\s+/g, "");
const extern = [];
if (has(p.dndbeyond_url)) extern.push(["D&D Beyond", cleanHref(list(p.dndbeyond_url)[0])]);
for (const u of list(p.urls)) {
	const s = String(u);
	const m = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
	if (m) extern.push([m[1].trim(), cleanHref(m[2])]);
	else if (/^https?:\s*\/\//.test(s)) {
		const href = cleanHref(s);
		extern.push([href.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], href]);
	}
}
if (extern.length) {
	const links = panel("Links");
	const bar = el(links, "div", "display:flex;flex-wrap:wrap;gap:.3rem;padding:.4rem 0;");
	for (const [label, href] of extern) {
		bar.createEl("a", { text: `${label} ↗`, attr: { href, target: "_blank", rel: "noopener",
			style: "font-size:.72rem;padding:.15em .6em;border-radius:6px;background:var(--background-primary);border:1px solid var(--background-modifier-border);text-decoration:none;" } });
	}
}

// ---- STATS ----
// A campaign counts what its own folder holds; the vault dashboard counts the
// same kinds across every campaign, so both wear the identical tile grid.
if (input?.stats !== false) {
	let tiles;
	if (isVault) {
		const all = dv.pages('"01 - Campaigns"');
		const ofType = (t) => all.where(q => dv.array(q.type).some(x => String(x).toLowerCase() === t)).length;
		tiles = [
			["Campaigns",  ofType("campaign"),      "#c9a24b"],
			["Sessions",   ofType("session"),       "#81c784"],
			["PCs",        ofType("player"),        "#64b5f6"],
			["Quests",     ofType("quest"),         "#2c6e49"],
			["NPCs",       ofType("npc"),           "#ffb74d"],
			["Factions",   ofType("faction"),       "#e57373"],
			["Locations",  ofType("location"),      "#a5d6a7"],
			["Establish.", ofType("establishment"), "#ba68c8"],
			["Lore",       ofType("lore"),          "#7986cb"],
			["Items",      ofType("inventory"),     "#4db6ac"],
		];
	} else {
		const C = p.file.folder.split("/").pop();
		const inFolder = (sub, t) => dv.pages(`"01 - Campaigns/${C}/${sub}"`)
			.where(q => dv.array(q.type).some(x => String(x).toLowerCase() === t)).length;
		tiles = [
			["Sessions",   inFolder("Sessions", "session"),              "#81c784"],
			["PCs",        inFolder("PC", "player"),                     "#64b5f6"],
			["Quests",     inFolder("Quests", "quest"),                  "#2c6e49"],
			["NPCs",       inFolder("World/NPC", "npc"),                 "#ffb74d"],
			["Factions",   inFolder("World/Factions", "faction"),        "#e57373"],
			["Locations",  inFolder("World/Locations", "location"),      "#a5d6a7"],
			["Establish.", inFolder("World/Establishments", "establishment"), "#ba68c8"],
			["Lore",       inFolder("World/Lores", "lore"),              "#64b5f6"],
			["Items",      inFolder("Inventory", "inventory"),           "#4db6ac"],
		];
	}

	const stats = panel("Stats");
	const gridEl = el(stats, "div", "display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;padding:.45rem 0 .5rem;");
	for (const [label, value, color] of tiles) {
		const tile = el(gridEl, "div", `padding:.35rem .2rem;text-align:center;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-top:2px solid ${color};border-radius:6px;`);
		el(tile, "div", "font-size:1.05rem;font-weight:700;color:var(--text-normal);line-height:1.1;", String(value));
		el(tile, "div", "font-size:.55rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-top:1px;", label);
	}
}

// ---- ACTIONS ----
// Every create button a Campaign Manager offers lives here — the note body carries
// none. Grouped so the panel titles say what each button set is for.
const CAMPAIGN_ACTION_GROUPS = [
	["Play", [
		["New Session", "Macro - Add Session", "#8a6d1f"],
		["New Player",  "Macro - Add Player",  "#3a5f8a"],
		["New Quest",   "Macro - Add Quest",   "#2c6e49"],
	]],
	["World", [
		["New NPC",           "Macro - Add NPC",           "#8a5a2b"],
		["New Faction",       "Macro - Add Faction",       "#6a3d9a"],
		["New Location",      "Macro - Add Location",      "#2f6d4f"],
		["New Establishment", "Macro - Add Establishment", "#9c4a2e"],
		["New Lore",          "Macro - Add Lore",          "#34508c"],
	]],
	["Items", [
		["New Item", "Macro - Add Inventory", "#4f5f28"],
	]],
];
// One panel per group: [title, [[label, choice, color], …]].
const groups = input?.actionGroups
	?? (input?.actions ? [["Actions", input.actions]] : CAMPAIGN_ACTION_GROUPS);
for (const [title, acts] of groups) {
	if (!acts?.length) continue;
	P.actionGrid(panel(title), acts);
}

// ---- ASSETS ----
// Upload-only: a campaign manager has no image frontmatter field, so image_upload
// runs without a `field` and just drops the file in the campaign's assets folder.
// The vault Dashboard shares this view and owns no assets folder, so it opts out.
if (input?.upload !== false && !isVault) {
	const body = panel("Assets");
	const bar = el(body, "div", "padding:.45rem 0 .5rem;");
	await dv.view("00 - Config/_obsi/_obsi_views/image_upload", {
		label: "Upload image",
		compact: true,
		container: bar,
	});
}
