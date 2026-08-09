/* location_table — every "Associated Locations" tier callout and the campaign
 * manager's "List of Locations".
 *
 * One of five views over `table_search`, all sharing their helpers via
 * `table_kit`. Search box only: the tier callouts are already narrowed to one
 * `location_type`, so a Type dropdown would offer a single option.
 *
 * Replaced twenty-one hand-written DQL copies — the tier loop and the
 * Other/Dungeons callouts in Template_Location, the nineteen baked into the four
 * location notes, and the campaign manager's unscoped list.
 *
 * Usage (dataviewjs), inside the callout:
 *   > [!table-data]- Cities
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "City" });
 *   > ```
 *
 * Options:
 *   link         : the location frontmatter field that must point back at THIS
 *                  note — "locations". Omit for every location in the campaign.
 *   type         : keep only locations whose `location_type` matches, e.g.
 *                  "Continent" / "City" / "Dungeon". Omit for all types.
 *   excludeTypes : array of `location_type` values to drop — how the `Other`
 *                  callout says "everything that is not a tier or a dungeon".
 *   showType     : add a `location_type` pill column. On for the campaign
 *                  manager, which lists every type at once; off for the tier
 *                  callouts, where the column would be a constant.
 *   campaign / folder / limit : as in the other table views. `folder` defaults to
 *                  `01 - Campaigns/{campaign}/World` — the whole world tree, not
 *                  `World/Locations`, matching the DQL this replaced. Locations
 *                  live in a nested folder-note tree with establishments in
 *                  sibling subfolders, so the `type` check is what keeps it honest.
 *
 * SCOPING NOTE, preserved deliberately: `locations` names a location's IMMEDIATE
 * parent, so these tables list direct children only. Soltpeak's Cities callout is
 * empty even though Amberhall sits physically beneath it, because Amberhall's
 * `locations` names Veilmoria. That was true of the DQL too; making descendants
 * roll up is a data-model change, not a rendering one.
 *
 * STYLING lives in .obsidian/snippets/dnd-tables.css, shared by all five tables.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/table_kit");
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { pill, avatar, slug, nameOf, arr, campaignOf, linksHere } = globalThis.DnDTables;
const { linkEl } = globalThis.DnDPanels;

const link = input?.link ?? null;
const wantType = input?.type ?? null;
const excluded = (input?.excludeTypes ?? []).map(slug);
const showType = input?.showType ?? false;

const campaign = campaignOf(dv, input);
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaigns` frontmatter.");
	return;
}
const folder = input?.folder ?? `01 - Campaigns/${campaign}/World`;

dv.container.classList.add("location-table");

const here = link ? linksHere(dv, link) : null;
const typeOf = (p) => dv.array(p.location_type ?? []).map(slug);
const typeOk = (p) => {
	const t = typeOf(p);
	if (wantType && !t.includes(slug(wantType))) return false;
	return !t.some((x) => excluded.includes(x));
};
const leaderName = (p) => { const t = arr(p.leader)[0]; return t ? nameOf(t) : ""; };

await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
	from: `"${folder}"`,
	where: (p) => String(p.type ?? "").toLowerCase() === "location"
		&& typeOk(p) && (!here || here(p)),
	headers: ["Leader", "Description", ...(showType ? ["Type"] : []), "Locations"],
	row: (p) => [
		avatar(dv, p.leader, linkEl),
		p.word_description ?? p.description ?? "—",
		...(showType ? [pill(p.location_type, "locationType")] : []),
		p.locations ?? "—",
	],
	sort: (p) => String(p.name ?? p.file.name).toLowerCase(),
	limit: input?.limit ?? 10,
	placeholder: "Search locations…",
	searchText: (p) => [p.location_type, p.terrain, p.theme, p.govtType, p.population, p.locations, leaderName(p)],
});
