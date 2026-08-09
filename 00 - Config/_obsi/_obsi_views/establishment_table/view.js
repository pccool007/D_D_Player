/* establishment_table — the "Table Shops/Services" callout on every Location.
 *
 * One of five views over `table_search`, all sharing their helpers via
 * `table_kit`. Search box only; `establishment_type` renders as a pill and the
 * Owner column shows a small portrait beside the owner's name.
 *
 * Replaced five hand-written DQL copies. All five sorted on
 * `file.establishment_type`, which is not a `file.` sub-field — the sort was a
 * silent no-op. This sorts on the note name, and the Type pill is what you scan
 * for grouping.
 *
 * Usage (dataviewjs), inside the callout:
 *   > [!table-data]- Table Shops/Services
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/establishment_table", { link: "locations" });
 *   > ```
 *
 * Options:
 *   link     : the establishment frontmatter field that must point back at THIS
 *              note — "locations". Omit for every establishment in the campaign.
 *   campaign : campaign name (default: the note's `campaigns` frontmatter link,
 *              else the campaign folder in its path).
 *   folder   : default `01 - Campaigns/{campaign}/World` — the whole world tree.
 *              Establishments live EITHER under `{Location}/Establishments/` or,
 *              when they have no parent location, under `World/Establishments/`,
 *              so no single folder holds them all. `type` is what narrows it.
 *   limit    : rows before the counter tells you to narrow down (default 10).
 *
 * `owner` is a metadata-menu File field — ONE link — but its picker offers
 * players, NPCs and factions, and a session capture can leave plain free text
 * when it named someone with no note. `avatar` handles all three, plus the empty
 * case (greyed placeholder + "Name Unknown"), so nothing here special-cases it.
 *
 * STYLING lives in .obsidian/snippets/dnd-tables.css, shared by all five tables.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/table_kit");
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { pill, avatar, nameOf, arr, campaignOf, linksHere } = globalThis.DnDTables;
const { linkEl } = globalThis.DnDPanels;

const link = input?.link ?? null;
const campaign = campaignOf(dv, input);
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaigns` frontmatter.");
	return;
}
const folder = input?.folder ?? `01 - Campaigns/${campaign}/World`;

dv.container.classList.add("establishment-table");

const here = link ? linksHere(dv, link) : null;
const ownerName = (p) => { const t = arr(p.owner)[0]; return t ? nameOf(t) : ""; };

await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
	from: `"${folder}"`,
	where: (p) => String(p.type ?? "").toLowerCase() === "establishment" && (!here || here(p)),
	headers: ["Owner", "Description", "Locations", "Type"],
	row: (p) => [
		avatar(dv, p.owner, linkEl),
		p.word_description ?? p.description ?? "—",
		p.locations ?? "—",
		pill(p.establishment_type, "establishmentType"),
	],
	sort: (p) => String(p.name ?? p.file.name).toLowerCase(),
	limit: input?.limit ?? 10,
	placeholder: "Search establishments…",
	searchText: (p) => [p.establishment_type, p.locations, ownerName(p)],
});
