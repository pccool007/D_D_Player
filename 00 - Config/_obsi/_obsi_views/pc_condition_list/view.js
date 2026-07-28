/* pc_condition_list — the Dead / Missing / Presumed Dead PC rosters on a
 * Campaign Manager, as a compact list.
 *
 * One line per PC: link — Class · Lvl N. The campaign's PC folder is derived
 * from the note's own location, so this works in any campaign.
 *
 * Usage (dataviewjs), inside the callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/pc_condition_list", { condition: "dead" });
 *   > ```
 *
 * Options:
 *   condition : the `condition` frontmatter value to match, compared
 *               case-insensitively — "dead" / "missing" / "presume dead"
 *               (default "dead").
 *   folder    : PC folder (default: this note's folder + "/PC").
 *   empty     : message when nobody matches (default "*None.*").
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const want = String(input?.condition ?? "dead").toLowerCase();
const folder = input?.folder ?? `${dv.current().file.folder}/PC`;
const empty = input?.empty ?? "*None.*";

const isPlayer = p => dv.array(p.type).some(t => String(t).toLowerCase() === "player");
const klass = p => dv.array(p.class).filter(Boolean).join("/") || "?";

const pcs = dv.pages(`"${folder}"`)
	.where(p => isPlayer(p) && String(p.condition ?? "alive").toLowerCase() === want)
	.sort(p => String(p.name ?? p.file.name).toLowerCase(), "asc");

if (!pcs.length) {
	dv.paragraph(empty);
} else {
	dv.list(pcs.map(p => {
		const link = dv.fileLink(p.file.path, false, p.name ?? p.file.name);
		const lvl = (p.level == null || p.level === "") ? "" : ` · Lvl ${Number(p.level) || 0}`;
		return `${link} — ${klass(p)}${lvl}`;
	}));
}
