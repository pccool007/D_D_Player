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
 *                  `type`). "vault" shows a date-only Info panel and no Stats —
 *                  Dashboard.md renders its own full-width stat bar.
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

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};

const list = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");
const has = (v) => list(v).length > 0;
const linkName = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();

const fmtDate = (d) => {
	if (d == null || d === "") return null;
	return dv.luxon.DateTime.isDateTime(d) ? d.toFormat("yyyy-MM-dd") : String(d).slice(0, 10);
};

// ---- panel scaffolding ----
const wrap = el(dv.container, "div", "display:flex;flex-direction:column;gap:.7rem;margin:.2rem 0 .1rem;");

const panel = (title) => {
	const g = el(wrap, "div", "border:1px solid var(--background-modifier-border);border-radius:12px;background:var(--background-secondary);overflow:hidden;");
	el(g, "div", "text-align:center;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);font-weight:600;padding:.5rem;border-bottom:1px solid var(--background-modifier-border);", title);
	return el(g, "div", "padding:.15rem .8rem .4rem;");
};

const ROW = "display:flex;justify-content:space-between;align-items:baseline;gap:.8rem;padding:.35rem 0;border-bottom:1px solid color-mix(in srgb,var(--background-modifier-border) 55%,transparent);font-size:.86rem;";
const VAL = "text-align:right;font-weight:500;color:var(--text-normal);";
const MUTED = "text-align:right;font-weight:400;color:var(--text-faint);";

// A row whose value is rendered by `fill`, or an em-dash when there's nothing.
const row = (body, key, value, fill) => {
	const r = el(body, "div", ROW);
	el(r, "span", "color:var(--text-muted);", key);
	if (!has(value)) { el(r, "span", MUTED, "—"); return; }
	fill(el(r, "span", VAL), value);
};
const textRow = (body, key, value) => row(body, key, value, (v, val) => v.appendText(list(val).map(linkName).join(" · ")));

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
const extern = [];
if (has(p.dndbeyond_url)) extern.push(["D&D Beyond", String(list(p.dndbeyond_url)[0])]);
for (const u of list(p.urls)) {
	const s = String(u);
	const m = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
	if (m) extern.push([m[1].trim(), m[2].trim()]);
	else if (/^https?:\/\//.test(s)) extern.push([s.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], s]);
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
// Skipped for the vault dashboard — it renders its own full-width stat bar.
if (input?.stats !== false && !isVault) {
	const C = p.file.folder.split("/").pop();
	const inFolder = (sub, t) => dv.pages(`"01 - Campaigns/${C}/${sub}"`)
		.where(q => dv.array(q.type).some(x => String(x).toLowerCase() === t)).length;
	const tiles = [
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
const qa = app.plugins.plugins.quickadd?.api;
for (const [title, acts] of groups) {
	if (!acts?.length) continue;
	const bar = el(panel(title), "div", "display:grid;grid-template-columns:repeat(2,1fr);gap:.3rem;padding:.45rem 0 .5rem;");
	for (const [label, choice, color] of acts) {
		const btn = bar.createEl("button", { text: label, attr: { style:
			`border:none;border-radius:5px;padding:.3em .4em;cursor:pointer;font-weight:600;font-size:11px;` +
			`line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f2e8d0;background:${color};` } });
		btn.onmouseenter = () => (btn.style.filter = "brightness(1.12)");
		btn.onmouseleave = () => (btn.style.filter = "");
		btn.onclick = () => qa?.executeChoice
			? qa.executeChoice(choice)
			: new Notice("QuickAdd API unavailable");
	}
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
