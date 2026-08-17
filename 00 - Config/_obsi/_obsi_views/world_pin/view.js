/* world_pin — the "Open World" button in a Campaign Manager's infobox.
 *
 * Opens the note the campaign's `world` property points at, in reading view,
 * and pins its tab — the same open+pin the Dashboard's campaign cards do, aimed
 * at the world instead of the manager. A tab already showing that note is
 * reused and re-pinned, so clicking twice never leaves two copies open.
 *
 * The world is read from frontmatter, never guessed: a campaign whose `world`
 * is empty (or points at a note that no longer exists) gets a greyed-out button
 * that says so on click, the same way the wizards grey out a picker with
 * nothing to offer.
 *
 * Usage: normally reached through `manager_aside`, which hands it the World
 * actions grid to render the button into, beside the `New …` buttons.
 *
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/world_pin");
 *   ```
 *
 * Options:
 *   container : element to append the button to (default dv.container). A nested
 *               dv.view() shares the PARENT's container, so a caller with its own
 *               layout must pass the element it wants the button inside.
 *   path      : campaign note to read `world` from (default the note rendering)
 *   label     : button text (default "Open World")
 *   color     : button background
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { actionButton, openPinned, notify } = globalThis.DnDPanels;

const host = input?.container ?? dv.container;
const label = input?.label ?? "Open World";
const color = input?.color ?? "#2f6d4f";
const notePath = input?.path ?? dv.currentFilePath;
const page = input?.path ? dv.page(input.path) : dv.current();

// `world` is a link — a Dataview Link object when Obsidian parsed the
// frontmatter, a bare "[[Name]]" string when it didn't. Both reduce to a
// linkpath, which is then resolved relative to the campaign note so an alias or
// a same-named note in another campaign lands on the right file.
const linkPath = (v) => {
	if (v == null || v === "") return null;
	const first = Array.isArray(v) ? v[0] : (v?.values?.[0] ?? v);
	if (first && typeof first === "object" && first.path) return first.path;
	const m = String(first).match(/\[\[([^\]|]+)/);
	return (m ? m[1] : String(first)).trim() || null;
};

const raw = linkPath(page?.world);
const target = raw
	? app.metadataCache.getFirstLinkpathDest(raw.replace(/\.md$/, ""), notePath)
	: null;

if (!target) {
	const why = raw
		? `The campaign's world, ${raw}, has no note in this vault.`
		: "This campaign has no `world` property set.";
	const btn = actionButton(host, label, color, () => notify(why));
	btn.style.opacity = ".45";
	btn.style.cursor = "not-allowed";
	btn.title = why;
	// It still answers a click with the reason, so it keeps its colour — but it
	// must not brighten on hover like a button that will do something.
	btn.onmouseenter = null;
	btn.onmouseleave = null;
} else {
	const btn = actionButton(host, label, color, async () => {
		await openPinned(target);
		notify(`Pinned ${target.basename}`);
	});
	btn.title = `Open + pin ${target.basename}`;
}
