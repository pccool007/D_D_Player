/* npc_table — the "List of NPC's" table, everywhere.
 *
 * One of five views over `table_search`, all sharing their helpers via
 * `table_kit`: search box, filter dropdowns, a 10-row cap and pills.
 *
 * Replaced twelve hand-written DQL copies — four templates and the eight notes
 * they had already been baked into. The campaign manager's copy had drifted and
 * was missing the `last_seen` column; there is now one column set, defined here.
 *
 * Usage (dataviewjs), inside the callout:
 *   > [!table-data] List of NPC's
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/npc_table", { link: "locations" });
 *   > ```
 *
 * Options:
 *   link     : the NPC frontmatter field that must point back at THIS note —
 *              "locations" (Location, Establishment) or "factions" (Faction).
 *              Omit for every NPC in the campaign (the Campaign Manager).
 *   campaign : campaign name (default: the note's `campaigns` frontmatter link,
 *              else the campaign folder in its path).
 *   folder   : NPC folder (default: `01 - Campaigns/{campaign}/World/NPC`).
 *   limit    : rows shown before the counter tells you to narrow down
 *              (default 10; Infinity for no cap).
 *
 * STYLING lives in .obsidian/snippets/dnd-tables.css, shared by all five tables.
 * A pill carries `data-npc-condition` / `data-npc-standing` — the value, slugged
 * — and the CSS turns that into `--dnd-tone`. That snippet and dnd-tokens.css
 * have to stay enabled in appearance.json, or the pills render as plain text.
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
const folder = input?.folder ?? `01 - Campaigns/${campaign}/World/NPC`;

// The class is the CSS hook AND the host that carries the --dnd-* tokens down to
// the pills. table_search renders into this same container — dv.view() hands a
// sub-view the caller's dv, it does not nest one.
dv.container.classList.add("npc-table");

const here = link ? linksHere(dv, link) : null;

await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
	from: `"${folder}"`,
	where: (p) => String(p.type ?? "").toLowerCase() === "npc" && (!here || here(p)),
	headers: ["Portrait", "Description", "Condition", "Relation", "Factions", "First Meeting Location", "Last Seen Location"],
	row: (p) => [
		p.npc_img?.toEmbed?.() ?? p.npc_img ?? "—",
		p.word_description ?? p.description ?? "—",
		pill(p.condition, "npcCondition"),
		pill(p.party_standing, "npcStanding"),
		p.factions ?? "—",
		p.first_location ?? "—",
		p.last_seen ?? "—",
	],
	sort: (p) => String(p.name ?? p.file.name).toLowerCase(),
	limit: input?.limit ?? 10,
	placeholder: "Search NPCs…",
	searchText: (p) => [p.race, p.subRace, p.occupation, p.condition, p.party_standing, p.factions, p.locations],
	filters: [
		{ label: "Race", value: (p) => p.race },
		{ label: "Condition", value: (p) => p.condition },
		{ label: "Relation", value: (p) => p.party_standing },
	],
});
