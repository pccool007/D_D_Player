/* session_table — the Sessions table on a Campaign Manager.
 *
 * The N most recent sessions render openly and the rest collapse into a
 * <details> fold.
 *
 * Adapted from the GM vault: this vault has no Calendarium plugin, so there are
 * no in-world fc-date / fc-end columns, and no one-shots — sessions are the only
 * kind of play note here.
 *
 * Usage (dataviewjs), inside the [!table-data] callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/session_table");
 *   > ```
 *
 * Options:
 *   folder : override the folder (default: this note's folder + "/Sessions").
 *   recent : rows shown before the fold (default 3).
 *   empty  : message when there are no sessions yet.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const cur = dv.current();
const folder = input?.folder ?? `${cur.file.folder}/Sessions`;
const RECENT = input?.recent ?? 3;
const empty = input?.empty ?? "*No sessions yet.*";

const isType = (p, t) => dv.array(p.type).some(x => String(x).toLowerCase() === t.toLowerCase());

// The base name a link-ish value points at, lowercased — lets us compare a
// frontmatter link against a resolved page regardless of how it was written.
const linkKey = (v) => String(v?.path ?? v ?? "")
	.replace(/^\[\[|\]\]$/g, "")
	.split("|")[0]
	.split("/").pop()
	.replace(/\.md$/, "")
	.trim()
	.toLowerCase();

const notes = dv.pages(`"${folder}"`)
	.where(p => isType(p, "session"))
	.sort(p => Number(p.session_num ?? 0), "desc");

const rows = [];
for (const s of notes) {
	// Outlinks give us "who/where did this session touch" without any manual upkeep.
	// The `world` frontmatter link is boilerplate on every note, not something the
	// session actually mentioned, so it never counts as a mentioned location.
	const worldKeys = new Set(dv.array(s.world).filter(Boolean).map(linkKey));
	const seen = new Set();
	const linked = (s.file.outlinks || [])
		.filter(l => { if (seen.has(l.path)) return false; seen.add(l.path); return true; })
		.map(l => dv.page(l.path))
		.filter(Boolean)
		.filter(p => !worldKeys.has(linkKey(p.file.path)));
	const npcs = linked.filter(p => isType(p, "NPC")).map(p => p.file.link);
	const locs = linked.filter(p => isType(p, "Location")).map(p => p.file.link);
	rows.push([
		dv.fileLink(s.file.path, false, s.file.name),
		s.session_num ?? "—",
		s.date ?? "—",
		s.important_event || "—",
		s.locations ?? "—",
		locs.length ? locs : "—",
		npcs.length ? npcs : "—",
	]);
}

const headers = ["Session", "#", "Date", "Summary", "Location", "Mentioned Locations", "Mentioned NPCs"];

if (!rows.length) {
	dv.paragraph(empty);
} else {
	dv.table(headers, rows.slice(0, RECENT));
	if (rows.length > RECENT) {
		const det = dv.container.createEl("details");
		const sum = det.createEl("summary", { text: `📜 Older sessions (${rows.length - RECENT})` });
		sum.style.cssText = "cursor:pointer;font-weight:600;margin:.5em 0;";
		await app.plugins.plugins.dataview.api.table(headers, rows.slice(RECENT), det, dv.component, dv.currentFilePath);
	}
}
