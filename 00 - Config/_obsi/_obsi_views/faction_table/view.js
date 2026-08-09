/* faction_table — the "List of Factions" / "Factions" table, everywhere.
 *
 * One of five views over `table_search`, all sharing their helpers via
 * `table_kit`. Status and Type render as pills, and the Leader column shows a
 * small portrait of the leading NPC beside their name.
 *
 * Replaced seven hand-written DQL copies. They had drifted badly: the two
 * campaign-manager copies carried five columns, the five location-scoped copies
 * carried exactly one (Description). There is now one column set, defined here.
 *
 * Usage (dataviewjs), inside the callout:
 *   > [!table-data]- Factions
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/faction_table", { link: "locations" });
 *   > ```
 *
 * Options:
 *   link     : the faction frontmatter field that must point back at THIS note.
 *              "locations" on a Location note; omit for every faction in the
 *              campaign (the Campaign Manager).
 *   campaign : campaign name (default: the note's `campaigns` frontmatter link,
 *              else the campaign folder in its path).
 *   folder   : faction folder (default: `01 - Campaigns/{campaign}/World/Factions`).
 *   limit    : rows shown before the counter tells you to narrow down
 *              (default 10; Infinity for no cap).
 *
 * `leader` is a metadata-menu File field — ONE link, to an NPC. Never contains()
 * it the way `locations` is treated. A faction with no leader is the normal state
 * for a fresh note, so `avatar` gives it the greyed placeholder and "Name
 * Unknown" rather than a dash.
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
const folder = input?.folder ?? `01 - Campaigns/${campaign}/World/Factions`;

dv.container.classList.add("faction-table");

const here = link ? linksHere(dv, link) : null;
const leaderName = (p) => { const t = arr(p.leader)[0]; return t ? nameOf(t) : ""; };

await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
	from: `"${folder}"`,
	where: (p) => String(p.type ?? "").toLowerCase() === "faction" && (!here || here(p)),
	headers: ["Leader", "Description", "Status", "Type", "Locations", "Goal"],
	row: (p) => [
		avatar(dv, p.leader, linkEl),
		p.word_description ?? p.description ?? "—",
		pill(p.faction_status, "factionStatus"),
		pill(p.faction_type, "factionType"),
		p.locations ?? "—",
		p.goal ?? "—",
	],
	sort: (p) => String(p.name ?? p.file.name).toLowerCase(),
	limit: input?.limit ?? 10,
	placeholder: "Search factions…",
	searchText: (p) => [p.faction_type, p.faction_status, p.goal, p.locations, p.emblem_description, leaderName(p)],
	filters: [
		{ label: "Type", value: (p) => p.faction_type },
		{ label: "Status", value: (p) => p.faction_status },
	],
});
