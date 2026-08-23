/* npc_race — the "Change Race" button in an NPC's infobox.
 *
 * An NPC's creature-type `race` is not just a frontmatter field: it also picks
 * the note's FOLDER (`World/NPC/{race}`), its `icon`, its `iconColor` and its
 * default portrait. NPCWizard sets all five at once from `IconRegistry`; editing
 * `race` afterwards — in the property editor, or by hand — moved none of them, so
 * a Humanoid promoted to Undead kept a green LiUser icon and sat in the wrong
 * folder until someone noticed.
 *
 * This is the one place that changes a race after creation. It opens a dropdown
 * of the registry's creature types, then does the same four things the wizard
 * does, in the same order the wizard's key order defines:
 *
 *   1. moves the note to `<campaign>/World/NPC/{race}/`, creating that folder if
 *      it does not exist yet, through `fileManager.renameFile` so every `[[link]]`
 *      to the NPC follows it
 *   2. writes `race`
 *   3. writes `icon` / `iconColor` from IconRegistry — never a free choice
 *   4. swaps `npc_img` for the new type's placeholder, but ONLY when it still
 *      holds a placeholder. Real art that someone uploaded is never touched.
 *
 * `subRace` is deliberately left alone: it is the player-facing race (Human,
 * Tiefling…), which does not change just because the creature type was corrected.
 *
 * Moving comes FIRST on purpose. It is the step that can fail on something out of
 * this view's hands (a name already taken in the target folder), and a note that
 * failed to move must keep the icon that matches where it still is.
 *
 * Usage: normally reached through `note_aside`'s npc schema (`actionViews`), which
 * hands it the Actions grid to render the button into.
 *
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/npc_race");
 *   ```
 *
 * Options:
 *   container : element to append the button to (default dv.container). A nested
 *               dv.view() shares the PARENT's container, so a caller with its own
 *               layout must pass the element it wants the button inside.
 *   path      : NPC note to change (default the note being rendered)
 *   label     : button text (default "Change Race")
 *   color     : button background
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { actionButton, promptSelect } = globalThis.DnDPanels;

const notePath = input?.path ?? dv.currentFilePath;
const label = input?.label ?? "Change Race";
const color = input?.color ?? "#6a3d9a";
const host = input?.container ?? dv.container;

/* IconRegistry, required by absolute path — the same idiom the wizards and
 * `table_kit` use, so a creature type's folder name, icon, colour and portrait all
 * come out of the one table that owns them. Node caches require(), so an edit to
 * IconRegistry.js needs an Obsidian reload to reach this view. Guarded: a registry
 * that fails to load must leave a button that says why when clicked, not throw
 * inside the infobox and take the rest of the panels down. */
let raceTable = null;
try {
	const path = require("path");
	raceTable = require(path.join(
		app.vault.adapter.basePath,
		"00 - Config", "_obsi", "_obsi_scripts", "Helpers", "_obsi_script_IconRegistry.js"
	))("npc");
} catch (e) {
	raceTable = null;
	console.error("npc_race: IconRegistry unavailable", e);
}

const frontmatter = (file) => app.metadataCache.getFileCache(file)?.frontmatter ?? {};

// The bare filename inside an `[[…]]`, a `[[…|alias]]`, or a plain string.
const embedName = (raw) => {
	const one = Array.isArray(raw) ? raw[0] : raw;
	if (one == null || one === "") return "";
	return String(one.path ?? one)
		.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop().trim();
};

// Every default portrait is named `placeHolderNPC…` (IconRegistry's `placeholder`
// values, plus the vault-wide `placeHolderNPCUnknown.png`). Uploaded art never is,
// which is what makes this safe to overwrite.
const isPlaceholder = (raw) => /^placeholder/i.test(embedName(raw));

/* The campaign's NPC root. Read off the note's OWN path where possible, so an NPC
 * filed straight under `World/NPC` (or nested deeper by hand) keeps its campaign
 * rather than being re-derived from a path segment that may not be one. */
const npcRootOf = (path) => {
	const inside = path.match(/^(.*\/World\/NPC)\//);
	if (inside) return inside[1];
	const segments = path.split("/");
	if (segments[0] === "01 - Campaigns" && segments.length > 2) {
		return `01 - Campaigns/${segments[1]}/World/NPC`;
	}
	return null;
};

const ensureFolder = async (folder) => {
	if (!(await app.vault.adapter.exists(folder))) await app.vault.createFolder(folder);
};

// Move into `<npc root>/<race>/`, keeping the filename. Returns what happened, so
// the Notice can say "moved" only when something actually moved.
const move = async (file, race) => {
	const root = npcRootOf(file.path);
	if (!root) return { moved: false, reason: "this note is not inside a campaign's World/NPC folder" };

	const folder = `${root}/${race}`;
	const target = `${folder}/${file.name}`;
	if (target === file.path) return { moved: false };

	const clash = app.vault.getAbstractFileByPath(target);
	if (clash && clash !== file) return { moved: false, reason: `${target} already exists` };

	await ensureFolder(folder);
	await app.fileManager.renameFile(file, target);
	return { moved: true, folder };
};

const run = async () => {
	if (!raceTable) {
		new Notice("npc_race: IconRegistry could not be loaded — reload Obsidian and try again.");
		return;
	}
	const file = app.vault.getAbstractFileByPath(notePath);
	if (!file || file.children) { new Notice("npc_race: could not find this note."); return; }

	const current = String(frontmatter(file).race ?? "").trim();
	const race = await promptSelect({
		title: "Change Creature Type",
		subtitle: "Refiles the note under World/NPC/{type} and resets its icon, colour and "
			+ "placeholder portrait. The player-facing race stays in subRace.",
		options: Object.keys(raceTable),
		value: current,
		cta: "Change",
	});
	if (race === null) return;                       // cancelled

	const style = raceTable[race] ?? {};
	const moved = await move(file, race);

	// The note may have moved — `file` is the same TFile either way, so this still
	// writes to the right note.
	let portrait = false;
	await app.fileManager.processFrontMatter(file, (fm) => {
		fm.race = race;
		if (style.icon) fm.icon = style.icon;
		if (style.iconColor) fm.iconColor = style.iconColor;
		if (style.placeholder && isPlaceholder(fm.npc_img)) {
			const next = `[[${style.placeholder}]]`;
			// Only a real swap is worth reporting: picking the type a note already
			// has is a repair pass, and "portrait updated" on an unchanged field
			// reads as art having been replaced.
			portrait = fm.npc_img !== next;
			fm.npc_img = next;
		}
	});

	const done = [`Creature type → ${race}`];
	if (moved.moved) done.push(`moved to ${moved.folder}`);
	if (moved.reason) done.push(`NOT moved (${moved.reason})`);
	if (style.icon) done.push(`icon ${style.icon}${style.iconColor ? ` (${style.iconColor})` : ""}`);
	if (portrait) done.push("placeholder portrait updated");
	new Notice(done.join("\n"));
};

const btn = actionButton(host, label, color, async () => {
	btn.disabled = true;
	try {
		await run();
	} catch (e) {
		new Notice(`Change race failed: ${e.message}`);
		console.error("npc_race", e);
	} finally {
		btn.disabled = false;
	}
});
