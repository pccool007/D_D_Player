/* session_hero — the banner at the top of a session note.
 *
 * Shows the session number, its date, the location played in, and the one-line
 * summary, plus prev/next links derived from `session_num` so you can walk the
 * campaign without going back to the Campaign Manager.
 *
 * Usage (dataviewjs):
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/session_hero");
 *   ```
 *
 * Options:
 *   page   : a Dataview page to render instead of the current note.
 *   folder : Sessions folder used for the prev/next lookup
 *            (default: this note's own folder).
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const p = input?.page ?? dv.current();
const folder = input?.folder ?? p.file.folder;

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};
const arr = (v) => v == null || v === "" ? [] : (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x ?? "").replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();
const fmtDate = (d) => {
	if (d == null || d === "") return null;
	return dv.luxon.DateTime.isDateTime(d) ? d.toFormat("cccc, dd LLL yyyy") : String(d).slice(0, 10);
};

const numOf = (q) => Number(q.session_num ?? 0) || 0;
const mine = numOf(p);

const wrap = el(dv.container, "div", "border:1px solid var(--background-modifier-border);border-radius:12px;background:var(--background-secondary);padding:.7rem .9rem .75rem;margin:.2rem 0 .6rem;");

// ---- title line: Session NNN + date ----
const head = el(wrap, "div", "display:flex;align-items:baseline;justify-content:space-between;gap:.8rem;flex-wrap:wrap;");
el(head, "div", "font-size:1.15rem;font-weight:700;letter-spacing:.02em;",
	mine ? `Session ${String(mine).padStart(3, "0")}` : "Session");
const when = fmtDate(p.date);
if (when) el(head, "div", "font-size:.8rem;color:var(--text-muted);", when);

// ---- summary ----
if (p.important_event) {
	el(wrap, "div", "margin-top:.3rem;font-size:.85rem;line-height:1.4;", String(p.important_event));
}

// ---- location / campaign chips ----
const chips = el(wrap, "div", "display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.45rem;");
const chip = (label, value) => {
	for (const v of arr(value)) {
		const c = el(chips, "span", "font-size:.68rem;padding:.15em .55em;border-radius:999px;background:var(--background-primary);border:1px solid var(--background-modifier-border);");
		el(c, "span", "color:var(--text-muted);", `${label} `);
		const target = (v && typeof v === "object" && v.path) ? v.path : nameOf(v);
		c.createEl("a", { text: nameOf(v), attr: { href: target, "data-href": target, class: "internal-link", style: "text-decoration:none;font-weight:600;" } });
	}
};
chip("in", p.locations);
// Child notes carry `campaigns`; `campaign` is the manager's own name, kept as a
// fallback for sessions created before the key was made consistent.
chip("·", p.campaigns ?? p.campaign);

// ---- prev / next ----
const siblings = dv.pages(`"${folder}"`)
	.where(q => dv.array(q.type).some(t => String(t).toLowerCase() === "session"))
	.array()
	.sort((a, b) => numOf(a) - numOf(b));

const prev = siblings.filter(q => numOf(q) < mine).pop();
const next = siblings.find(q => numOf(q) > mine);

if (prev || next) {
	const nav = el(wrap, "div", "display:flex;justify-content:space-between;gap:.8rem;margin-top:.6rem;padding-top:.5rem;border-top:1px solid color-mix(in srgb,var(--background-modifier-border) 60%,transparent);font-size:.75rem;");
	const side = (page, prefix, align) => {
		const s = el(nav, "div", `flex:1;text-align:${align};`);
		if (!page) { el(s, "span", "color:var(--text-faint);", "—"); return; }
		s.createEl("a", { text: `${prefix} ${page.file.name}`, attr: { href: page.file.path, "data-href": page.file.path, class: "internal-link", style: "text-decoration:none;" } });
	};
	side(prev, "←", "left");
	side(next, "→", "right");
}
