/* location_move — the "Move Location" button in a location note's infobox.
 *
 * A location's parent is not just its `locations` field: locations are FOLDER
 * NOTES (`{Name}/{Name}.md`) nested inside their parent's folder, under the tier
 * folder their type maps to —
 *
 *   Soltpeak/Continents/Forterian Isle/Countries/Veilmoria/Cities/Amberhall/
 *
 * — so the hierarchy IS the folder tree. `LocationForm` builds that path once, at
 * creation; nothing rebuilt it afterwards, so re-parenting a location meant
 * dragging its folder by hand and remembering to fix `locations` too.
 *
 * This moves the whole FOLDER, which is what carries the subtree: moving Veilmoria
 * takes `Cities/Amberhall` — and Amberhall's `Establishments/` — with it, because
 * they live inside it. Their own `locations` fields are untouched and stay right:
 * Amberhall's parent is still Veilmoria.
 *
 * The dropdown offers only parents this location may legally nest under, out of
 * `LocationHierarchy`'s rules — the same ones the wizards gate their type list on:
 * a tiered child must sit STRICTLY deeper than its parent, an environment (Forest,
 * Dungeon…) nests anywhere, and anything nests under an environment. Its own
 * subtree is excluded, since a folder cannot move inside itself.
 *
 * `location_type` / `location_tier_level` are NOT touched — this changes where a
 * Country sits, not the fact that it is one. Its tier is what the parent list is
 * filtered by, so the note stays legal wherever this button can put it.
 *
 * Usage: normally reached through `note_aside`'s location schema (`actionViews`),
 * which hands it the Actions grid to render the button into.
 *
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/location_move");
 *   ```
 *
 * Options:
 *   container : element to append the button to (default dv.container). A nested
 *               dv.view() shares the PARENT's container, so a caller with its own
 *               layout must pass the element it wants the button inside.
 *   path      : location note to move (default the note being rendered)
 *   label     : button text (default "Move Location")
 *   color     : button background
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { actionButton, promptSelect } = globalThis.DnDPanels;

const notePath = input?.path ?? dv.currentFilePath;
const label = input?.label ?? "Move Location";
const color = input?.color ?? "#3f5d8c";
const host = input?.container ?? dv.container;

/* The two helpers that own the location tree — required by absolute path, the same
 * idiom the wizards and `table_kit` use. The nesting rules and the tier→folder map
 * live in `LocationHierarchy` and are NOT restated here: this view and
 * `LocationForm` must agree on where a location belongs, and two copies of that
 * rule is exactly how "Cities/" and "City/" both happened. Node caches require(),
 * so an edit to either needs an Obsidian reload to reach this view. Guarded: a
 * helper that fails to load must leave a button that says why when clicked, not
 * throw inside the infobox and take the rest of the panels down. */
let categories = null;
let hierarchy = null;
try {
	const path = require("path");
	const helper = (file) => require(path.join(
		app.vault.adapter.basePath, "00 - Config", "_obsi", "_obsi_scripts", "Helpers", file
	));
	categories = helper("_obsi_script_IconRegistry.js")("location");
	hierarchy = helper("_obsi_script_LocationHierarchy.js")();
} catch (e) {
	categories = hierarchy = null;
	console.error("location_move: location helpers unavailable", e);
}

const TOP_LEVEL = "— None (top level) —";

const fmOf = (file) => app.metadataCache.getFileCache(file)?.frontmatter ?? {};
const typeOf = (file) => String(fmOf(file).type ?? "").toLowerCase();

// A location is a folder note: `{Name}/{Name}.md`. One that is not is a
// pre-migration leftover — the same case `EstablishmentWizard` guards for. Nothing
// can nest inside it, so it cannot be a destination.
const isFolderNote = (file) => !!file?.parent && file.parent.name === file.basename;

const campaignRootOf = (path) => {
	const segments = path.split("/");
	return segments[0] === "01 - Campaigns" && segments.length > 2
		? `01 - Campaigns/${segments[1]}`
		: null;
};

const tierOf = (file) => hierarchy.tierOf(fmOf(file), categories);

// The tier (or environment) folder this location goes in, wherever it lands.
// `location_type` is the answer; `location_tier_level` is the fallback for a note
// whose type predates the registry.
const bucketOf = (file) => {
	const fm = fmOf(file);
	const picked = categories.find(c => c.label === fm.location_type);
	if (picked) return hierarchy.bucketFor(picked);
	const tier = tierOf(file);
	return tier == null ? null : (hierarchy.TIER_FOLDER[tier] ?? null);
};

// The location (or "top level") a candidate currently sits in — only used to tell
// two same-named locations apart in the dropdown.
const containerOf = (file) => {
	const bucket = isFolderNote(file) ? file.parent.parent : file.parent;
	const owner = bucket?.parent;
	return owner && owner.name !== "Locations" ? owner.name : "top level";
};

/* Every location in the campaign this one may legally nest under. The tier rule is
 * `allowedChildTypes` read from the other end: instead of "which types fit under
 * this parent", "which parents fit this type". Both come out of the same
 * strictly-deeper comparison, so the wizards and this button agree. */
const parentsFor = (file) => {
	const root = campaignRootOf(file.path);
	if (!root) return [];
	const myTier = tierOf(file);
	const ownFolder = isFolderNote(file) ? file.parent.path + "/" : null;
	return app.vault.getMarkdownFiles()
		.filter(f => f.path.startsWith(root + "/"))
		.filter(f => typeOf(f) === "location")
		.filter(f => f !== file)
		// A folder cannot move inside itself, so its own subtree is not a choice.
		.filter(f => !(ownFolder && f.path.startsWith(ownFolder)))
		.filter(f => {
			const tier = tierOf(f);
			return tier == null || myTier == null || myTier > tier;
		})
		.sort((a, b) => a.basename.localeCompare(b.basename));
};

const optionsFor = (files) => {
	const seen = new Map();
	for (const f of files) seen.set(f.basename, (seen.get(f.basename) ?? 0) + 1);
	return [
		[TOP_LEVEL, ""],
		...files.map((f) => {
			const type = fmOf(f).location_type;
			const name = type ? `${f.basename} (${type})` : f.basename;
			// Only when two locations share a name — the path is what tells them
			// apart, and it is noise on every other row.
			return [seen.get(f.basename) > 1 ? `${name} — in ${containerOf(f)}` : name, f.path];
		}),
	];
};

// The parent the note claims now, as one of the candidates above, so the dropdown
// opens on it. A broken or missing link opens on "top level", which is what the
// note effectively says.
const currentParent = (file, candidates) => {
	const raw = [].concat(fmOf(file).locations ?? []).filter(Boolean)[0];
	if (!raw) return "";
	const name = String(raw).replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop().trim();
	return candidates.find(f => f.basename === name)?.path ?? "";
};

// Everything that rides along: the notes inside this location's own folder.
const subtreeOf = (file) => (isFolderNote(file)
	? app.vault.getMarkdownFiles().filter(f => f.path.startsWith(file.parent.path + "/") && f !== file)
	: []);

// createFolder throws on an existing folder and on a missing parent, so walk down.
const ensureFolder = async (folder) => {
	const segments = folder.split("/");
	for (let i = 1; i <= segments.length; i++) {
		const step = segments.slice(0, i).join("/");
		if (!(await app.vault.adapter.exists(step))) await app.vault.createFolder(step);
	}
};

/* Where this location's FOLDER belongs under `parent` (null = the campaign's
 * Locations root), through LocationHierarchy so the path matches the one
 * `LocationForm` would have built for a location created there. */
const destinationFor = (file, parent) => {
	const root = campaignRootOf(file.path);
	const bucket = bucketOf(file);
	if (!root) return { error: "this note is not inside a campaign folder" };
	if (!bucket) {
		return { error: `${file.basename} has no location_type this vault knows — set one before moving it` };
	}
	if (parent && !isFolderNote(parent)) {
		return { error: `${parent.basename} is not a folder note ({Name}/{Name}.md), so nothing can nest inside it` };
	}
	const base = parent
		? `${parent.parent.path}/${bucket}`
		: `${root}/World/Locations/${bucket}`;
	return { folder: `${base}/${file.basename}` };
};

/* Moves the location's folder, which is what takes its children with it. A note
 * that is not a folder note is moved INTO one, since that is the shape everything
 * else in the vault (child locations, Establishments/) nests against.
 *
 * `fileManager.renameFile`, not `vault.rename`: only the former updates links, and
 * a folder move can change the relative path of every link inside the subtree. */
const move = async (file, parent) => {
	const target = destinationFor(file, parent);
	if (target.error) return target;

	const source = isFolderNote(file) ? file.parent : file;
	const destination = isFolderNote(file) ? target.folder : `${target.folder}/${file.name}`;
	if (source.path === destination) return { moved: false };
	if (app.vault.getAbstractFileByPath(destination)) {
		return { error: `${destination} already exists` };
	}
	// Belt and braces — `parentsFor` already excludes the subtree, but a folder
	// moved inside itself is unrecoverable, so it is checked here too.
	if (isFolderNote(file) && destination.startsWith(source.path + "/")) {
		return { error: "a location cannot move inside its own subtree" };
	}

	await ensureFolder(isFolderNote(file) ? target.folder.split("/").slice(0, -1).join("/") : target.folder);
	await app.fileManager.renameFile(source, destination);
	return { moved: true, folder: target.folder };
};

const run = async () => {
	if (!categories || !hierarchy) {
		new Notice("location_move: the location helpers could not be loaded — reload Obsidian and try again.");
		return;
	}
	const file = app.vault.getAbstractFileByPath(notePath);
	if (!file || file.children) { new Notice("location_move: could not find this note."); return; }

	const candidates = parentsFor(file);
	const riders = subtreeOf(file).length;
	const answer = await promptSelect({
		title: `Move ${file.basename}`,
		subtitle: (riders
			? `Moves this location's folder and the ${riders} note${riders === 1 ? "" : "s"} inside it. `
			: "Moves this location's folder. ")
			+ "Only parents a "
			+ (fmOf(file).location_type || "location")
			+ " may nest under are listed.",
		options: optionsFor(candidates),
		value: currentParent(file, candidates),
		cta: "Move",
	});
	if (answer === null) return;                     // cancelled

	const parent = answer ? app.vault.getAbstractFileByPath(answer) : null;
	if (answer && !parent) { new Notice("location_move: that parent no longer exists."); return; }

	const result = await move(file, parent);
	if (result.error) { new Notice(`Not moved — ${result.error}.`); return; }

	// A location's `locations` is its hierarchy parent and nothing else — it is what
	// decides its folder, which is why `withWorld`/`withDimension` deliberately skip
	// it. So this is set, not appended to.
	await app.fileManager.processFrontMatter(file, (fm) => {
		fm.locations = parent ? [`[[${parent.basename}]]`] : null;
	});

	const done = [`${file.basename} → ${parent ? parent.basename : "top level"}`];
	if (result.moved) {
		done.push(result.folder);
		if (riders) done.push(`${riders} note${riders === 1 ? "" : "s"} moved with it`);
	} else {
		done.push("already in the right folder — parent link refreshed");
	}
	new Notice(done.join("\n"));
};

const btn = actionButton(host, label, color, async () => {
	btn.disabled = true;
	try {
		await run();
	} catch (e) {
		new Notice(`Move location failed: ${e.message}`);
		console.error("location_move", e);
	} finally {
		btn.disabled = false;
	}
});
