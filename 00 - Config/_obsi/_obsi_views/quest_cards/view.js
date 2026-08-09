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
 * STYLING lives in .obsidian/snippets/quest-card.css, not here. The card
 * carries `data-qc-status` — the quest's status, slugged — and the CSS turns
 * that into `--qc-tone`, the colour of the top border, the pill and the hover.
 * Adding a status colour is a line of CSS, not a line of JS; an unrecognised
 * status falls back to grey. That snippet and dnd-tokens.css (which it reads
 * its borders and status colours from) have to stay enabled in appearance.json,
 * or these cards render unstyled.
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

// Child notes link their campaign in `campaigns`; a manager resolves via fromPath.
const fromLink = arr(cur.campaigns).map(nameOf).filter(Boolean)[0];
const fromPath = (cur.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
const campaign = input?.campaign ?? fromLink ?? fromPath;
if (!campaign) {
	dv.paragraph("⚠️ Cannot resolve the campaign for this note — set its `campaign` frontmatter.");
	return;
}

// Status → data attribute. The colours themselves live in extra.css; a status
// with no rule there just keeps the neutral grey.
const slug = (v) => String(v ?? "").trim().toLowerCase().replace(/\s+/g, "-");

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

const el = (parent, tag, cls, text) => parent.createEl(tag, { cls: cls ?? undefined, text: text ?? undefined });

const grid = el(dv.container, "div", "qc-grid");

const metaRow = (parent, label, value) => {
	const vals = arr(value);
	if (!vals.length) return;
	const r = el(parent, "div", "qc-row");
	el(r, "span", "qc-row-key", label);
	const v = el(r, "span", "qc-row-val");
	vals.forEach((x, idx) => {
		if (idx) v.appendText(", ");
		if (x && typeof x === "object" && x.path) {
			v.createEl("a", { cls: "internal-link", text: nameOf(x), attr: { href: x.path, "data-href": x.path } });
		} else {
			const m = String(x).match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
			if (m) {
				const t = m[1].trim();
				v.createEl("a", { cls: "internal-link", text: (m[2] || m[1]).trim(), attr: { href: t, "data-href": t } });
			} else v.appendText(String(x));
		}
	});
};

for (const q of quests) {
	const st = String(arr(q.quest_status)[0] ?? "To Do");

	const card = el(grid, "div", "qc-card");
	card.dataset.qcStatus = slug(st);

	const head = el(card, "div", "qc-head");
	head.createEl("a", { cls: "internal-link qc-title", text: q.name ?? q.file.name,
		attr: { href: q.file.path, "data-href": q.file.path } });
	el(head, "span", "qc-pill", st);

	if (q.description) {
		el(card, "div", "qc-desc", String(q.description));
	}

	metaRow(card, "Owner", q.owner);
	metaRow(card, "Location", q.locations);
	metaRow(card, "Reward", q.reward);
	metaRow(card, "Time Delay", q.time_delay);
}
