/* quest_cards — the campaign's quests as a card grid instead of a table.
 *
 * Each card shows the quest name, a status pill, its description and the
 * owner / location / reward / time-delay rows. Reads the campaign's Quests
 * folder, resolved from the note's own frontmatter, so the same block works
 * in any campaign.
 *
 * Usage (dataviewjs):
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/quest_cards", { status: "active" });
 *   ```
 *
 * Options:
 *   status   : "active" (not yet finished) | "done" | "all". Default "active".
 *   campaign : campaign name (default: the note's `campaign` / `campaigns`
 *              frontmatter link, else the campaign folder in its path).
 *   empty    : message when nothing matches.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const status = input?.status ?? "active";
const cur = dv.current();

const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x ?? "").replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();
const arr = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");

const fromLink = arr(cur.campaign ?? cur.campaigns).map(nameOf).filter(Boolean)[0];
const fromPath = (cur.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
const campaign = input?.campaign ?? fromLink ?? fromPath;
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaign` frontmatter.");
	return;
}

// Status → pill colour. Anything unrecognised falls back to grey.
const STATUS_COLORS = {
	"to do": "#c9a24b",
	"in progress": "#6aa9f0",
	"completed": "#5fae5f",
	"done": "#5fae5f",
	"failed": "#cc5a4a",
	"abandoned": "#8a8a8a",
};
const isQuest = p => dv.array(p.type).some(t => String(t).toLowerCase().includes("quest"));
const isDone = p => dv.array(p.quest_status).some(s => /\b(done|completed)\b/i.test(String(s)));

let quests = dv.pages(`"01 - Campaigns/${campaign}/Quests"`).where(isQuest);
if (status === "done") quests = quests.where(isDone);
else if (status !== "all") quests = quests.where(p => !isDone(p));

quests = quests.sort(p => [String(p.quest_status ?? ""), String(p.name ?? p.file.name)], "asc");

if (!quests.length) {
	dv.paragraph(input?.empty ?? (status === "done" ? "*No completed quests yet.*" : "*No active quests.*"));
	return;
}

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};

const grid = el(dv.container, "div", "display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin:.3rem 0;");

const ROW = "display:flex;justify-content:space-between;gap:.6rem;font-size:.74rem;padding:.18rem 0;";
const metaRow = (parent, label, value) => {
	const vals = arr(value);
	if (!vals.length) return;
	const r = el(parent, "div", ROW);
	el(r, "span", "color:var(--text-muted);", label);
	const v = el(r, "span", "text-align:right;font-weight:500;");
	vals.forEach((x, idx) => {
		if (idx) v.appendText(", ");
		if (x && typeof x === "object" && x.path) {
			v.createEl("a", { text: nameOf(x), attr: { href: x.path, "data-href": x.path, class: "internal-link", style: "text-decoration:none;" } });
		} else {
			const m = String(x).match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
			if (m) {
				const t = m[1].trim();
				v.createEl("a", { text: (m[2] || m[1]).trim(), attr: { href: t, "data-href": t, class: "internal-link", style: "text-decoration:none;" } });
			} else v.appendText(String(x));
		}
	});
};

for (const q of quests) {
	const st = String(arr(q.quest_status)[0] ?? "To Do");
	const color = STATUS_COLORS[st.toLowerCase()] ?? "#8a8a8a";

	const card = el(grid, "div", `border:1px solid var(--background-modifier-border);border-top:3px solid ${color};border-radius:10px;background:var(--background-primary);padding:.6rem .75rem .7rem;display:flex;flex-direction:column;gap:.2rem;`);

	const head = el(card, "div", "display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;");
	head.createEl("a", { text: q.name ?? q.file.name, attr: { href: q.file.path, "data-href": q.file.path, class: "internal-link",
		style: "font-weight:700;font-size:.95rem;text-decoration:none;" } });
	el(head, "span", `flex:none;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:.15em .5em;border-radius:999px;color:${color};background:color-mix(in srgb,${color} 14%,var(--background-secondary));border:1px solid color-mix(in srgb,${color} 32%,transparent);`, st);

	if (q.description) {
		el(card, "div", "font-size:.76rem;color:var(--text-muted);margin:.15rem 0 .25rem;line-height:1.35;", String(q.description));
	}

	metaRow(card, "Owner", q.owner);
	metaRow(card, "Location", q.locations);
	metaRow(card, "Reward", q.reward);
	metaRow(card, "Time Delay", q.time_delay);
}
