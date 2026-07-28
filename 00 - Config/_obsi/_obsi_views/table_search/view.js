/* table_search — shared searchable table for [!table-data] callouts.
 * Renders a search box + table capped at `limit` rows (default 10;
 * pass Infinity for no cap); typing in the box filters live.
 * Optional dropdowns via `filter` (single) or `filters` (array).
 * Optional `searchText` adds extra fields to the search haystack.
 *
 * Usage (dataviewjs):
 *   await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
 *     from: '"01 - Campaigns"',
 *     where: p => dv.array(p.type).includes("NPC"),
 *     headers: ["Race", "Description"],
 *     row: p => [p.race, p.description],
 *     sort: p => p.file.name,        // fn or [fn, fn, …] (first = primary key)
 *     limit: 10,                      // or Infinity for no cap
 *     placeholder: "Search…",
 *     searchText: p => [p.race, p.factions],   // optional extra haystack
 *     requireQuery: true,             // hide the table until something is typed
 *                                     // or a dropdown filter is picked
 *     filters: [
 *       // static options + custom matcher ("All" handled by your match):
 *       { options: ["All", "Humanoid", "Undead"], match: (p, c) => c === "All" || p.race == c },
 *       // dynamic: options auto-collected from the pages (arrays/links ok):
 *       { label: "Faction", value: p => p.factions },
 *     ],
 *   });
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const {
	from,
	where = () => true,
	headers = [],
	row = () => [],
	sort = (p) => p.file.name,
	limit = 10,
	placeholder = "Search…",
	filter = null,
	filters = null,
	searchText = null,
	requireQuery = false,
} = input;

const api = app.plugins.plugins.dataview.api;

// Stable multi-key sort: apply keys last → first.
let pages = dv.pages(from).where(where);
for (const key of (Array.isArray(sort) ? [...sort] : [sort]).reverse())
	pages = pages.sort(key, "asc");

// Flatten any value (arrays, Link objects, …) to searchable text.
const txt = (v) =>
	v == null ? "" :
	Array.isArray(v) ? v.map(txt).join(" ") :
	typeof v === "object" ? String(v.display ?? v.path ?? "") :
	String(v);

// Short label for a single value (Links → note basename).
const optText = (v) =>
	v == null ? "" :
	typeof v === "object" && v.path ? String(v.display ?? v.path.split("/").pop().replace(/\.md$/, "")) :
	String(v);

const fieldCss =
	"padding:4px 10px;border-radius:6px;" +
	"border:1px solid var(--background-modifier-border);background:var(--background-primary);";

const controls = dv.container.createEl("div");
controls.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin:4px 0;";

// Normalize filter defs; build each dropdown.
const filterDefs = filters ?? (filter ? [filter] : []);
const selects = [];
for (const f of filterDefs) {
	const select = controls.createEl("select");
	select.style.cssText = fieldCss;
	if (f.options) {
		// Static options + caller-provided match (caller handles its own "All").
		for (const opt of f.options) select.createEl("option", { text: opt, value: opt });
		select.value = f.default ?? f.options[0];
	} else {
		// Dynamic: collect distinct values of f.value(p) across all pages.
		const seen = new Set();
		for (const p of pages) for (const v of dv.array(f.value(p) ?? [])) {
			const t = optText(v);
			if (t) seen.add(t);
		}
		select.createEl("option", { text: f.label ? `${f.label}: All` : "All", value: "" });
		for (const t of [...seen].sort((a, b) => a.localeCompare(b)))
			select.createEl("option", { text: t, value: t });
		f.match = (p, choice) =>
			choice === "" || dv.array(f.value(p) ?? []).some((v) => optText(v) === choice);
	}
	selects.push([f, select]);
}

const search = controls.createEl("input", { type: "search", attr: { placeholder } });
search.style.cssText = "flex:1;min-width:140px;" + fieldCss;
const counter = dv.container.createEl("div");
counter.style.cssText = "font-size:11px;color:var(--text-muted);margin:0 0 4px;";
const holder = dv.container.createEl("div");

// Search haystack: name, aliases, word_description, description + searchText extras.
const hay = (p) =>
	[p.file.name, txt(p.aliases), txt(p.word_description), txt(p.description), searchText ? txt(searchText(p)) : ""]
		.join(" ")
		.toLowerCase();

async function render() {
	const q = search.value.trim().toLowerCase();
	const narrowed = q !== "" || selects.some(([, s]) => s.value !== "");
	if (requireQuery && !narrowed) {
		counter.textContent = "Type to search…";
		holder.empty();
		return;
	}
	let filtered = pages;
	for (const [f, select] of selects)
		filtered = filtered.where((p) => f.match(p, select.value));
	if (q) filtered = filtered.where((p) => hay(p).includes(q));
	counter.textContent =
		filtered.length > limit
			? `Showing ${limit} of ${filtered.length} — search to narrow down`
			: `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
	holder.empty();
	const shown = Number.isFinite(limit) ? filtered.limit(limit) : filtered;
	await api.table(
		["Name", ...headers],
		shown.map((p) => [p.file.link, ...row(p)]).array(),
		holder,
		dv.component,
		dv.currentFilePath
	);
}
let timer;
search.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(render, 120); });
for (const [, select] of selects) select.addEventListener("change", render);
await render();
