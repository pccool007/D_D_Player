/* panels — the shared look of every stacked-panel infobox in this vault.
 *
 * dv.view() cannot return a value (Dataview renders anything truthy into the
 * container), so this follows the same trick as `dashboard`: it assigns its
 * helpers onto a global and renders nothing. Consume it with:
 *
 *   await dv.view("00 - Config/_obsi/_obsi_views/panels");
 *   const { stack, panel, textRow, linkRow } = globalThis.DnDPanels;
 *
 * `manager_aside` and `pc_card` grew their own verbatim copies of el/wrap/panel
 * before this existed. New views must use this one — three copies of a card
 * border is how two panels end up looking almost, but not quite, the same.
 *
 * Link rendering comes from `dashboard`'s appendValue rather than
 * manager_aside's linkName: the templates these panels replace wrote
 * `=link(this.factions)` where they wanted something clickable, and a plain
 * string would quietly drop that.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};

// null / scalar / array / Dataview {values} → a filtered array.
const list = (v) => v == null || v === ""
	? []
	: (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");
const has = (v) => list(v).length > 0;

// Dataview Link object or "[[target|alias]]" string → display name.
const linkName = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();

// Render a value as a real internal-link anchor. False when it is not a link.
const linkEl = (parent, val) => {
	if (val && typeof val === "object" && typeof val.path === "string") {
		parent.createEl("a", {
			text: val.display || val.path.split("/").pop().replace(/\.md$/, ""),
			attr: { href: val.path, "data-href": val.path, class: "internal-link" },
		});
		return true;
	}
	const m = String(val).match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
	if (!m) return false;
	const target = m[1].trim();
	parent.createEl("a", {
		text: (m[2] || m[1]).trim(),
		attr: { href: target, "data-href": target, class: "internal-link" },
	});
	return true;
};

// Append a scalar / link / array, keeping links clickable.
const appendValue = (parent, value) => {
	const items = list(value);
	if (!items.length) { parent.appendText("—"); return; }
	items.forEach((v, i) => {
		if (i) parent.appendText(", ");
		if (!linkEl(parent, v)) parent.appendText(linkName(v));
	});
};

const fmtDate = (d, luxon) => {
	if (d == null || d === "") return null;
	return luxon?.DateTime?.isDateTime?.(d) ? d.toFormat("yyyy-MM-dd") : String(d).slice(0, 10);
};

// ITS Theme puts a border of its own around `.callout-content`. With bordered
// panels inside it, every infobox reads as a double frame. Neutralise the outer
// one — scoped by `:has()` so it only applies to callouts that actually hold a
// panel stack, and injected once rather than shipped as a CSS snippet (which
// would need enabling in appearance.json to work at all).
const STACK_CLASS = "obsi-panel-stack";
const STYLE_ID = "obsi-panels-style";
if (!document.getElementById(STYLE_ID)) {
	const style = document.createElement("style");
	style.id = STYLE_ID;
	// Descendant, not `:has(>)`: Dataview renders into its own
	// `.block-language-dataviewjs` wrapper, so the stack is never a direct child
	// of the callout content and a child combinator would never match.
	style.textContent =
		`.callout-content:has(.${STACK_CLASS}) { border: none !important; padding: 0 !important; }`;
	document.head.appendChild(style);
}

const CARD = "border:1px solid var(--background-modifier-border);border-radius:12px;"
	+ "background:var(--background-secondary);overflow:hidden;";
const CARD_TITLE = "text-align:center;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;"
	+ "color:var(--text-muted);font-weight:600;padding:.5rem;";

// The column every panel stacks into. One per view, held by the caller.
const stack = (container) => {
	const s = el(container, "div", "display:flex;flex-direction:column;gap:.7rem;margin:.2rem 0 .1rem;");
	s.addClass?.(STACK_CLASS) ?? (s.className = STACK_CLASS);
	return s;
};

// A bordered card with an uppercase header. Returns its BODY, to append into.
// Pass no title for a bare card (an image panel wants no header bar).
const panel = (wrap, title) => {
	const g = el(wrap, "div", CARD);
	if (title) {
		el(g, "div", CARD_TITLE + "border-bottom:1px solid var(--background-modifier-border);", title);
	}
	return el(g, "div", "padding:.15rem .8rem .4rem;");
};

// A header with nothing under it — the note's name, where `panel()` would leave
// an empty padded body below the bar.
const header = (wrap, title) => el(el(wrap, "div", CARD), "div", CARD_TITLE, title);

const ROW = "display:flex;justify-content:space-between;align-items:baseline;gap:.8rem;padding:.35rem 0;"
	+ "border-bottom:1px solid color-mix(in srgb,var(--background-modifier-border) 55%,transparent);font-size:.86rem;";
const VAL = "text-align:right;font-weight:500;color:var(--text-normal);";
const MUTED = "text-align:right;font-weight:400;color:var(--text-faint);";

// A key/value row, or an em-dash when there is nothing to show.
const row = (body, key, value, fill) => {
	const r = el(body, "div", ROW);
	el(r, "span", "color:var(--text-muted);", key);
	if (!has(value)) { el(r, "span", MUTED, "—"); return r; }
	fill(el(r, "span", VAL), value);
	return r;
};
const textRow = (body, key, value) =>
	row(body, key, value, (span, val) => span.appendText(list(val).map(linkName).join(" · ")));
const linkRow = (body, key, value) => row(body, key, value, appendValue);

// A grid of QuickAdd buttons, the shape manager_aside's action panels use.
const actionGrid = (body, actions, columns = 2) => {
	const qa = app.plugins.plugins.quickadd?.api;
	const bar = el(body, "div",
		`display:grid;grid-template-columns:repeat(${columns},1fr);gap:.3rem;padding:.45rem 0 .5rem;`);
	for (const [label, choice, color] of actions) {
		const btn = bar.createEl("button", { text: label, attr: { style:
			"border:none;border-radius:5px;padding:.3em .4em;cursor:pointer;font-weight:600;font-size:11px;"
			+ `line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f2e8d0;background:${color};` } });
		btn.onmouseenter = () => (btn.style.filter = "brightness(1.12)");
		btn.onmouseleave = () => (btn.style.filter = "");
		btn.onclick = () => qa?.executeChoice
			? qa.executeChoice(choice)
			: new Notice("QuickAdd API unavailable");
	}
	return bar;
};

globalThis.DnDPanels = {
	el, list, has, linkName, linkEl, appendValue, fmtDate,
	stack, panel, header, row, textRow, linkRow, actionGrid,
	ROW, VAL, MUTED, CARD, CARD_TITLE, STACK_CLASS,
};
