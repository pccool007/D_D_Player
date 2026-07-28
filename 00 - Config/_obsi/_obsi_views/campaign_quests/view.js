/* campaign_quests — the Active / Done quest tables for a campaign or session note.
 *
 * Reads the campaign's Quests folder, resolved from the note's own frontmatter
 * rather than a hardcoded path, so the same block works in any campaign.
 *
 * Usage (dataviewjs), inside the [!table-data] callout:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/campaign_quests", { status: "active" });
 *   > ```
 *
 * Options:
 *   status   : "active" → quests not yet Completed, sorted by status then name;
 *                         columns Description / Status / Time Delay / Location /
 *                         Reward / Owner.
 *              "done"   → the finished ones; columns Description / Status / Reward.
 *              (default "active")
 *   campaign : campaign name (default: the note's `campaign` / `campaigns`
 *              frontmatter link, else the campaign folder in its path).
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const status = input?.status ?? "active";
const cur = dv.current();
const nm = x => x && x.path
	? x.path.split("/").pop().replace(/\.md$/, "")
	: String(x ?? "").replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop();

// Child notes link their campaign in `campaigns`. A campaign manager has no such
// key — it IS the campaign — so it resolves through fromPath below.
const fromLink = dv.array(cur.campaigns ?? []).map(nm).filter(Boolean)[0];
const fromPath = (cur.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
const campaign = input?.campaign ?? fromLink ?? fromPath;
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaign` frontmatter.");
	return;
}

const isQuest = p => dv.array(p.type).some(t => String(t).toLowerCase().includes("quest"));
// Anything Completed / Done counts as finished; everything else is still open.
const isDone = p => dv.array(p.quest_status)
	.some(s => /\b(done|completed)\b/i.test(String(s)));

let quests = dv.pages(`"01 - Campaigns/${campaign}/Quests"`)
	.where(p => isQuest(p) && (status === "done" ? isDone(p) : !isDone(p)));

if (!quests.length) {
	dv.paragraph(status === "done" ? "*No completed quests yet.*" : "*No active quests.*");
} else if (status === "done") {
	dv.table(["Quest", "Description", "Status", "Reward"],
		quests.map(p => [p.file.link, p.description, p.quest_status, p.reward]));
} else {
	quests = quests.sort(p => [String(p.quest_status ?? ""), String(p.name ?? p.file.name)], "asc");
	dv.table(["Quest", "Description", "Status", "Time Delay", "Location", "Reward", "Owner"],
		quests.map(p => [p.file.link, p.description, p.quest_status, p.time_delay, p.locations, p.reward, p.owner]));
}
