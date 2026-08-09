/* lore_table — the "Lores" callout on every note type, and the campaign
 * manager's "List of Lore".
 *
 * One of five views over `table_search`, all sharing their helpers via
 * `table_kit`. Search box plus a Type dropdown; `lore_type` renders as a pill.
 *
 * Replaced twelve hand-written DQL copies. The two campaign-level ones selected
 * `word_description` and `location_type` — fields a Lore note does not have — so
 * BOTH their columns rendered blank. The real fields are `description` and
 * `lore_type`, which is what this uses.
 *
 * Usage (dataviewjs), inside the callout:
 *   >[!table-data]- Lores
 *   >```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/lore_table", { link: "relations" });
 *   >```
 *
 * Options:
 *   link     : the lore frontmatter field that must point back at THIS note.
 *              "relations" everywhere it is scoped — an NPC, faction or location
 *              collects the lore that names it. Omit for every lore entry in the
 *              campaign (the Campaign Manager).
 *   campaign : campaign name (default: the note's `campaigns` frontmatter link,
 *              else the campaign folder in its path).
 *   folder   : lore folder (default: `01 - Campaigns/{campaign}/World/Lores`).
 *   limit    : rows before the counter tells you to narrow down (default 10).
 *
 * FIELD NAMES, as they really are: `relations` (what every scoped block filters
 * on), `secret` — SINGULAR, there is no `secrets` — and `locations`. A lore note
 * carries both `relations` and `locations`; only `relations` is ever scoped on,
 * so lore attached solely through `locations` stays invisible. That was true of
 * the DQL too and is left alone here.
 *
 * STYLING lives in .obsidian/snippets/dnd-tables.css, shared by all five tables.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/table_kit");
const { pill, campaignOf, linksHere } = globalThis.DnDTables;

const link = input?.link ?? null;
const campaign = campaignOf(dv, input);
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaigns` frontmatter.");
	return;
}
const folder = input?.folder ?? `01 - Campaigns/${campaign}/World/Lores`;

dv.container.classList.add("lore-table");

const here = link ? linksHere(dv, link) : null;

await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
	from: `"${folder}"`,
	where: (p) => String(p.type ?? "").toLowerCase() === "lore" && (!here || here(p)),
	headers: ["Type", "Description", "Related", "Secret", "Locations"],
	row: (p) => [
		pill(p.lore_type, "loreType"),
		p.description ?? p.word_description ?? "—",
		p.relations ?? "—",
		p.secret ?? "—",
		p.locations ?? "—",
	],
	sort: (p) => String(p.name ?? p.file.name).toLowerCase(),
	limit: input?.limit ?? 10,
	placeholder: "Search lore…",
	searchText: (p) => [p.lore_type, p.secret, p.relations, p.locations],
	filters: [{ label: "Type", value: (p) => p.lore_type }],
});
