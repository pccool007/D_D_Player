/* dashboard — shared helper library for Dashboard.md dataviewjs blocks.
 *
 * dv.view() does NOT return a value to the caller: Dataview renders any
 * truthy return into the container. So this view assigns its helpers onto
 * a global (globalThis.DnDDash) and returns nothing. Consume it with:
 *
 *   await dv.view("00 - Config/_obsi/_obsi_views/dashboard");
 *   const { isActive, fmtField, linkEl, appendValue, appendRich, toFile,
 *           addRow, addRowMixed, openCampaign } = globalThis.DnDDash;
 *
 * The value helpers are pure (DOM + formatting only) — they don't capture `dv`,
 * so they work in any block once imported. openCampaign touches the workspace
 * via the global `app`.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */

// A campaign counts as "active" when its status contains "active".
const isActive = (s) =>
	s != null && (Array.isArray(s) ? s.join(" ") : String(s)).toLowerCase().includes("active");

// Flatten any value to a short display string (Links/wikilinks → basename).
const fmtField = (v) => {
	if (v == null) return "—";
	if (Array.isArray(v)) return v.map(fmtField).join(", ");
	if (typeof v === "object" && v.path) return v.path.split("/").pop().replace(/\.md$/, "");
	return String(v).replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop();
};

// Plain "label: value" row.
const addRow = (parent, label, valueText) => {
	const row = parent.createEl("div");
	row.createEl("span", { text: `${label}: `, attr: { style: "color:var(--text-muted);font-weight:600;" } });
	row.createEl("span", { text: valueText });
	return row;
};

// Render a value that may be a wikilink (dataview Link or "[[Name]]" string)
// as a clickable internal link. Returns false when it isn't a link.
const linkEl = (parent, val) => {
	if (val && typeof val === "object" && typeof val.path === "string") {
		const label = val.display || val.path.split("/").pop().replace(/\.md$/, "");
		parent.createEl("a", { text: label, attr: { href: val.path, "data-href": val.path, class: "internal-link" } });
		return true;
	}
	const m = String(val).match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
	if (m) {
		const target = m[1].trim();
		parent.createEl("a", { text: (m[2] || m[1]).trim(), attr: { href: target, "data-href": target, class: "internal-link" } });
		return true;
	}
	return false;
};

// Append a value (scalar, link, or array) into parent, rendering links live.
const appendValue = (parent, value) => {
	if (value == null || value === "") { parent.appendText("—"); return; }
	const arr = Array.isArray(value) ? value
		: (value && typeof value === "object" && Array.isArray(value.values) ? value.values : null);
	if (arr) {
		if (!arr.length) { parent.appendText("—"); return; }
		arr.forEach((v, i) => { if (i) parent.appendText(", "); appendValue(parent, v); });
		return;
	}
	if (!linkEl(parent, value)) parent.appendText(fmtField(value));
};

// Append free text that may embed wikilinks *inline* ("Recruited for the
// [[Vernawood]] heist"). appendValue would collapse that to just the link —
// this keeps the prose around it.
const appendRich = (parent, value) => {
	const text = String(value ?? "");
	const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
	let i = 0, m;
	while ((m = re.exec(text))) {
		if (m.index > i) parent.appendText(text.slice(i, m.index));
		const target = m[1].trim();
		parent.createEl("a", { text: (m[2] || m[1]).trim(), attr: { href: target, "data-href": target, class: "internal-link" } });
		i = m.index + m[0].length;
	}
	if (i < text.length) parent.appendText(text.slice(i));
};

// Resolve a path / wikilink / Dataview Link to a TFile.
const toFile = (ref, srcPath = "") => {
	if (!ref) return null;
	if (typeof ref === "object" && ref.path) {
		return app.vault.getAbstractFileByPath(ref.path)
			?? app.metadataCache.getFirstLinkpathDest(ref.path, srcPath);
	}
	const raw = String(ref).replace(/^\[\[|\]\]$/g, "").split("|")[0].split("#")[0].trim();
	return app.vault.getAbstractFileByPath(raw)
		?? app.metadataCache.getFirstLinkpathDest(raw, srcPath);
};

// "label: value" row where value may contain wikilinks rendered clickable.
const addRowMixed = (parent, label, value) => {
	const row = parent.createEl("div");
	row.createEl("span", { text: `${label}: `, attr: { style: "color:var(--text-muted);font-weight:600;" } });
	appendValue(row.createEl("span"), value);
	return row;
};

// --- open + pin (Active Campaigns card buttons) ------------------------------
// This vault has no separate Worlds tree, so unlike the GM vault there is no
// world note to anchor beside the campaign — we pin the campaign manager, and
// today's session too when one exists.

const _notify = (msg) => {
	// `Notice` is an Obsidian global; require("obsidian") doesn't resolve from a
	// dv.view() module, so fall back to console if it isn't in scope.
	try { new Notice(msg); } catch (e) { console.log("[Dashboard]", msg); }
};

// Force a markdown leaf into reading (preview) view.
const _toReadingView = async (leaf) => {
	const state = leaf.view?.getState?.() ?? {};
	if (state.mode === "preview") return;
	await leaf.setViewState({ type: "markdown", state: { ...state, mode: "preview" }, active: true });
};

// Open a file in reading view and pin it. Reuses an existing tab already
// showing the file (re-pinning it) so repeated clicks don't spawn duplicates.
const _openPinned = async (file, { reuseActive = false } = {}) => {
	const existing = app.workspace.getLeavesOfType("markdown")
		.find(l => l.view?.file?.path === file.path);
	if (existing) {
		app.workspace.setActiveLeaf(existing, { focus: true });
		await _toReadingView(existing);
		existing.setPinned(true);
		return existing;
	}
	const leaf = app.workspace.getLeaf(reuseActive ? false : "tab");
	await leaf.openFile(file, { state: { mode: "preview" } });
	leaf.setPinned(true);
	return leaf;
};

// Open + pin a campaign manager, and today's session after it when passed.
// `campaign` / `todaySession` are Dataview pages — they need `.file.path`.
const openCampaign = async (campaign, todaySession) => {
	const campaignFile = campaign?.file?.path
		? app.vault.getAbstractFileByPath(campaign.file.path)
		: null;
	if (!campaignFile) { _notify("Campaign note not found."); return; }

	const names = [campaignFile.basename];
	await _openPinned(campaignFile, { reuseActive: true });

	const sessionFile = todaySession?.file?.path
		? app.vault.getAbstractFileByPath(todaySession.file.path)
		: null;
	if (sessionFile) {
		await _openPinned(sessionFile);
		names.push(sessionFile.basename);
	}

	_notify(`Pinned ${names.join(" + ")}`);
};

globalThis.DnDDash = { isActive, fmtField, addRow, linkEl, appendValue, appendRich, toFile, addRowMixed, openCampaign };
