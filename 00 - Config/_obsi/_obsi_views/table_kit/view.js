/* table_kit — the shared parts of every searchable table in this vault.
 *
 * dv.view() cannot return a value (Dataview renders anything truthy into the
 * container), so this follows the same trick as `panels` and `dashboard`: it
 * assigns its helpers onto a global and renders nothing. Consume it with:
 *
 *   await dv.view("00 - Config/_obsi/_obsi_views/table_kit");
 *   const { pill, avatar, campaignOf, linksHere } = globalThis.DnDTables;
 *
 * `npc_table` and `faction_table` each grew their own verbatim copy of slug /
 * pill / avatar / campaign resolution before this existed, and three more table
 * views were about to make it five. New table views must use this one.
 *
 * The five consumers — `npc_table`, `faction_table`, `location_table`,
 * `establishment_table`, `lore_table` — are then little more than a column list,
 * a filter list and a `where` clause handed to `table_search`.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */

// Dataview Link object or "[[target|alias]]" string → display name.
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x ?? "").replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();

// null / scalar / array / Dataview {values} → a filtered array.
const arr = (v) => v == null || v === ""
	? []
	: (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");

/* Value → data-attribute token.
 *
 * Collapses every run of non-alphanumerics, not just whitespace, so
 * "Commerce & Trade" → "commerce-trade" and "Player_Lore" → "player-lore"
 * rather than leaking `&` and `_` into CSS selectors. For every value already in
 * use this matches the older whitespace-only slug in pc_roster / pc_card /
 * quest_cards exactly ("presume dead" → "presume-dead", "in progress" →
 * "in-progress"), so no existing rule shifts. */
const slug = (v) => String(v ?? "").trim().toLowerCase()
	.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* A status or category pill.
 *
 * Returns a real DOM element: Dataview's renderValue has an isHtml branch that
 * appends an HTMLElement cell as-is, which is how a pill gets into the table
 * without table_search knowing anything about it.
 *
 * `attr` is the camelCase dataset key — "npcCondition", "factionStatus",
 * "loreType" … — and the COLOUR for its value lives in dnd-tables.css. Adding a
 * colour is a line of CSS, not a line of JS; an unrecognised value keeps grey. */
const pill = (value, attr) => {
	const text = String(value ?? "").trim();
	if (!text) return "—";
	const el = document.createElement("span");
	el.className = "dnd-pill";
	el.dataset[attr] = slug(text);
	el.textContent = text;
	return el;
};

/* IconRegistry, required by absolute path — the same idiom the wizards use, so a
 * creature type's PORTRAIT comes from the one table that already owns its icon and
 * its colour. This is the only require() in this file and it is guarded on purpose:
 * a registry that fails to load must cost a portrait, not take all five tables down.
 * Node caches require(), so an edit to IconRegistry.js needs an Obsidian reload to
 * reach this view — the same caveat the wizards have. */
let iconRegistry = null;
try {
	const path = require("path");
	iconRegistry = require(path.join(
		app.vault.adapter.basePath,
		"00 - Config", "_obsi", "_obsi_scripts", "Helpers", "_obsi_script_IconRegistry.js"
	));
} catch (e) { iconRegistry = null; }

/* Every default portrait lives in assetsDefault/ and is named by BARE BASENAME —
 * Obsidian resolves image wikilinks by name, which is what lets that folder be
 * reorganised without touching a note, and it is the shape every Template_*.md
 * already writes. Never write a path here; image_upload's full paths are for
 * uploaded art, where two campaigns can each hold a "Grug.png". */
const TYPE_PLACEHOLDER = {
	npc: "placeHolderNPCUnknown.png",
	player: "placeHolderPlayer.png",
	faction: "placeHolderFactions.png",
	location: "placeHolderLocations.png",
	establishment: "placeHolderEstablishment.png",
	lore: "placeHolderLore.png",
	inventory: "placeHolderItem.png",
};

/* The per-creature-type portrait, out of the same IconRegistry `npc` table that owns
 * the type's icon and colour — a type's art is never a free choice. The extension is
 * part of the table's value (Unknown is a .png, the other fourteen .jpg), so this
 * never appends one. */
const racePlaceholder = (race) => {
	const key = String(nameOf(race) ?? "").trim();
	if (!iconRegistry || !key) return null;
	try { return iconRegistry("npc")?.[key]?.placeholder ?? null; }
	catch (e) { return null; }
};

// The note's own `type`, as a TYPE_PLACEHOLDER key.
const typeKeyOf = (page) => slug(arr(page?.type).map(nameOf)[0] ?? "");

// Frontmatter holds a vault path or a bare filename; both have to resolve.
const fileFor = (raw, fromPath) => raw
	? (app.vault.getAbstractFileByPath(raw) ?? app.metadataCache.getFirstLinkpathDest(raw, fromPath))
	: null;

const imgPathOf = (page) => {
	// NPC is the only type whose image field is not `img`.
	const field = page?.npc_img ?? page?.img;
	if (!field) return null;
	const one = Array.isArray(field) ? field[0] : field;
	return one?.path ?? String(one).replace(/^\[\[|\]\]$/g, "").split("|")[0];
};

/* Portrait + name in one cell.
 *
 * Handles all three shapes these fields actually take. A Faction's `leader` and
 * an Establishment's `owner` are metadata-menu File fields, but the pickers
 * differ (leader → NPC; owner → player, NPC or faction) and ParseCapture can
 * write plain free text into either when a capture named someone with no note.
 * So:
 *   link      → that note's portrait + a clickable internal-link anchor
 *   free text → placeholder + the text, unlinked
 *   empty     → placeholder greyed out + "Name Unknown" (an unfilled field is
 *               the normal state of a fresh note, not an error worth a dash)
 *
 * `linkEl` comes from `panels`, the vault's one way to build an internal-link
 * anchor; the caller loads it and passes it in so table_kit stays dependency-free.
 */
const avatar = (dv, value, linkEl) => {
	const target = arr(value)[0] ?? null;
	const isLink = !!(target && typeof target === "object" && target.path);
	const wrap = document.createElement("span");
	wrap.className = "dnd-avatar";

	const page = isLink ? dv.page(target.path) : null;
	const here = dv.current().file.path;
	/* Most specific portrait first: the note's own image, then its creature type's,
	 * then its note type's, then the Unknown NPC as the vault-wide catch-all — which
	 * is also what free text and an empty field get, since neither resolves a page.
	 * `type: player` is the one exception to race-first: PCWizard fills a PC's `race`
	 * from the same creature-type list, but a PC's portrait is their player art. */
	const typeKey = typeKeyOf(page);
	const fallback = (typeKey === "player" ? null : racePlaceholder(page?.race))
		?? TYPE_PLACEHOLDER[typeKey]
		?? TYPE_PLACEHOLDER.npc;
	const file = fileFor(imgPathOf(page), page?.file?.path ?? here)
		?? fileFor(fallback, here);

	if (file) {
		wrap.createEl("img", { cls: "dnd-avatar-img" })
			.setAttribute("src", app.vault.getResourcePath(file));
	}
	if (!target) {
		wrap.classList.add("is-unknown");
		wrap.createEl("span", { cls: "dnd-avatar-name", text: "Name Unknown" });
	} else if (!(isLink && linkEl && linkEl(wrap, target))) {
		wrap.createEl("span", { cls: "dnd-avatar-name", text: nameOf(target) });
	}
	return wrap;
};

/* Campaign for the current note: an explicit option, then its `campaigns`
 * frontmatter link, then the campaign folder in its own path. Returns null when
 * none resolves — the caller reports that rather than querying garbage. */
const campaignOf = (dv, input) => {
	const cur = dv.current();
	const fromLink = arr(cur.campaigns).map(nameOf).filter(Boolean)[0];
	const fromPath = (cur.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1];
	return input?.campaign ?? fromLink ?? fromPath ?? null;
};

/* "does this page point back at the note we're rendering in?"
 *
 * Path match is what survives a rename — the DQL these views replaced baked the
 * title in at template-expansion time, so renaming a location emptied its own
 * tables. The name fallback covers a link that has not resolved yet, e.g. a note
 * the wizard wrote before its target existed. */
const linksHere = (dv, field) => {
	const cur = dv.current();
	const here = cur.file.path;
	const hereName = String(cur.file.name).toLowerCase();
	return (p) => dv.array(p[field] ?? [])
		.some((v) => (v?.path ? v.path === here : nameOf(v).toLowerCase() === hereName));
};

globalThis.DnDTables = { slug, nameOf, arr, pill, avatar, campaignOf, linksHere };
