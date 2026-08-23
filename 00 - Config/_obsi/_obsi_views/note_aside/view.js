/* note_aside — the [!infobox] of any note, rendered as stacked panels.
 *
 * The counterpart to `manager_aside`: that one is the campaign's infobox, this
 * one is every other note's. Nine templates used to hand-write the same thing in
 * markdown — a `# =this.file.name` heading, an `###### Section` bar, a borderless
 * table of `**Label** | =this.field |` rows, an `infobox_img` call and an
 * `action_bar` — and the nine copies had drifted: missing trailing pipes in
 * Faction, lowercase labels in Quest, a double-space cell in Session, a
 * hardcoded image in Lore.
 *
 * Now the callout holds one line, exactly like the Campaign Manager's:
 *
 *   > [!infobox]
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
 *   > ```
 *
 * The note's `type` selects its schema below — no per-template options, so a row
 * is added in one place and every note of that type has it.
 *
 * Options (all optional — the templates pass none):
 *   type    : force a schema instead of reading the note's `type`
 *   title   : false to drop the title panel
 *   image   : false to drop the image panel
 *   actions : [[label, choice, color], …] to replace the type's buttons; [] drops them
 *   actionViews : view paths that render their own button into the Actions grid
 *             (a session's "Add Resume"); [] drops them
 *
 * The `[!infobox]` callout itself is styled by ITS Theme (float:right, 300px
 * cap, hidden callout title). These panels are sized to live inside that, and
 * carry their own inline styling, so no snippet or `cssclasses` is needed.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { el, has, list, stack, panel, header, textRow, linkRow, actionGrid, fmtDate } = globalThis.DnDPanels;

// A row is [label, field] for plain text, or [label, field, "link"] where the
// markdown said `=link(...)` — anything that should stay clickable.
// [label, field, "date"] formats a Luxon date, [label, [a, b], "pair"] renders
// "a (b)", which is how an NPC's race and sub-race were written.
const SCHEMAS = {
	npc: {
		image: { field: "npc_img", label: "NPC" },
		sections: [
			["Bio", [
				["Race", ["race", "subRace"], "pair"],
				["Sex", "gender"],
				["Age", "age"],
				["Sexuality", "sexuality"],
				["Condition", "condition"],
				["Languages", "languages"],
			]],
			["Info", [
				["Occupation(s)", "occupation"],
				["Faction(s)", "factions", "link"],
				["Location", "locations", "link"],
				["First Meeting Location", "first_location", "link"],
			]],
		],
		// Changing the creature type is a view, not a QuickAdd choice: it refiles
		// this note and rewrites its icon/colour/portrait rather than creating
		// another note. Editing `race` in the property editor does none of that.
		actionViews: ["00 - Config/_obsi/_obsi_views/npc_race"],
	},

	player: {
		image: { field: "img", label: "Player" },
		// The PC's stats come from pc_card, which is already a view.
		sections: [],
		views: ["00 - Config/_obsi/_obsi_views/pc_card"],
	},

	quest: {
		sections: [
			["Info", [
				["Status", "quest_status"],
				["Reward", "reward"],
				["Owner", "owner", "link"],
				["Time Delay", "time_delay"],
				["Locations", "locations", "link"],
			]],
		],
	},

	faction: {
		image: { field: "img", label: "Faction" },
		sections: [
			["Bio", [
				["Aliases", "aliases"],
				["Leader", "leader", "link"],
				["Emblem Description", "emblem_description"],
				["Faction Type", "faction_type"],
				["Status", "faction_status"],
				["Current Location", "locations", "link"],
				["Alignment", "alignment"],
			]],
		],
		actions: [["New NPC", "Macro - Add NPC", "#8a5a2b"]],
	},

	location: {
		image: { field: "img", label: "Location" },
		sections: [
			["Info", [
				["Alias", "aliases"],
				["Type", "location_type"],
				["Parent", "locations", "link"],
				["Population", "population"],
				["Theme", "theme"],
				["Terrain", "terrain"],
			]],
			["Politics", [
				["Leaders", "leader", "link"],
				["Govt Type", "govtType"],
				// Label is US spelling, the frontmatter key is British. Both stay
				// as they were — renaming the key would orphan existing notes.
				["Defenses", "defences"],
			]],
			["Commerce", [
				["Imports", "imports"],
				["Exports", "exports"],
			]],
		],
		actions: [
			["New Location",      "Macro - Add Location (Child)", "#2f6d4f"],
			["New Establishment", "Macro - Add Establishment",    "#9c4a2e"],
			["New NPC",           "Macro - Add NPC",              "#8a5a2b"],
			["New Faction",       "Macro - Add Faction",          "#6a3d9a"],
			["New Quest",         "Macro - Add Quest",            "#2c6e49"],
		],
	},

	establishment: {
		image: { field: "img", label: "Establishment" },
		sections: [
			["Info", [
				["Alias", "aliases"],
				["Location", "locations", "link"],
				["Type", "establishment_type"],
			]],
			["Politics", [
				["Owner(s)", "owner", "link"],
			]],
		],
		actions: [["New NPC", "Macro - Add NPC", "#8a5a2b"]],
	},

	lore: {
		image: { field: "img", label: "Lore" },
		sections: [
			["Info", [
				["Alias", "aliases"],
				["Type", "lore_type"],
				["Related", "relations", "link"],
				["Location", "locations", "link"],
			]],
		],
	},

	inventory: {
		image: { field: "img", label: "Item" },
		sections: [
			["Info", [
				["Alias", "aliases"],
				["Type", "item_type"],
				["Owner", "owner", "link"],
				["Value (gp)", "gold_value"],
			]],
		],
	},

	session: {
		// A session's name is its number and date, both already in the Info panel,
		// and session_hero carries the banner above the callout.
		title: false,
		sections: [
			["Info", [
				["Session Number", "session_num"],
				["Location", "locations", "link"],
				["Events", "important_event"],
				["Date", "date", "date"],
			]],
		],
		// The resume button is a view, not a QuickAdd choice: it writes into this
		// note's own Summary callout rather than creating another one.
		actionViews: ["00 - Config/_obsi/_obsi_views/session_resume"],
		actions: [
			["New NPC",           "Macro - Add NPC",           "#8a5a2b"],
			["New Location",      "Macro - Add Location",      "#2f6d4f"],
			["New Establishment", "Macro - Add Establishment", "#9c4a2e"],
			["New Faction",       "Macro - Add Faction",       "#6a3d9a"],
			["New Quest",         "Macro - Add Quest",         "#2c6e49"],
			["New Lore",          "Macro - Add Lore",          "#34508c"],
			["New Item",          "Macro - Add Inventory",     "#4f5f28"],
		],
	},
};

// Dataview's index lags a note created seconds ago — a session note straight out
// of the macro renders before it is indexed, `dv.current()` comes back empty, and
// the infobox claimed the note had no `type` when its frontmatter was fine.
// Obsidian's metadata cache is written the moment the file is; `linkEl` and
// `fmtDate` already accept the raw "[[…]]" and date strings it hands back.
const fromCache = () => {
	const fm = app.metadataCache.getCache(dv.currentFilePath)?.frontmatter;
	return fm && { ...fm, file: { name: dv.currentFilePath.split("/").pop().replace(/\.md$/, "") } };
};
const p = dv.current() ?? fromCache();
const type = String(input?.type ?? p?.type ?? "").toLowerCase();
const schema = SCHEMAS[type];

if (!schema) {
	// A note whose `type` nothing renders — say so rather than drawing nothing,
	// which reads as "the view is broken".
	dv.paragraph(type
		? `note_aside: no infobox schema for type "${type}".`
		: "note_aside: this note has no `type` in its frontmatter.");
} else {
	const wrap = stack(dv.container);

	// ---- title ----
	// The old markdown put this in a `# ` heading, which ITS Theme renders as the
	// callout's grey title bar. `header` is that bar and nothing else — `panel`
	// would hang an empty padded body underneath it.
	if (input?.title !== false && schema.title !== false) {
		const name = p?.file?.name ?? "";
		const aliases = has(p?.aliases) ? ` (${list(p.aliases).join(", ")})` : "";
		header(wrap, `${name}${aliases}`);
	}

	// ---- image ----
	if (input?.image !== false && schema.image) {
		const body = panel(wrap);
		await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", {
			...schema.image,
			container: el(body, "div", "padding:.4rem 0;"),
		});
	}

	// ---- rows ----
	for (const [title, rows] of schema.sections ?? []) {
		const body = panel(wrap, title);
		for (const [label, field, kind] of rows) {
			if (kind === "pair") {
				const [a, b] = field.map(f => p?.[f]);
				textRow(body, label, has(a) ? (has(b) ? `${a} (${b})` : a) : null);
			} else if (kind === "link") {
				linkRow(body, label, p?.[field]);
			} else if (kind === "date") {
				textRow(body, label, fmtDate(p?.[field], dv.luxon));
			} else {
				textRow(body, label, p?.[field]);
			}
		}
	}

	// ---- nested views (a PC's card) ----
	// Handed the stack itself, not a panel body — pc_card draws its own panels,
	// and a card inside a card reads as a mistake.
	for (const view of schema.views ?? []) {
		await dv.view(view, { container: wrap });
	}

	// ---- actions ----
	// `actionViews` are views that render their OWN button — they go into the same
	// grid as the QuickAdd ones, so the panel stays one block of buttons.
	const actions = input?.actions ?? schema.actions ?? [];
	const actionViews = input?.actionViews ?? schema.actionViews ?? [];
	if (actions.length || actionViews.length) {
		// One lone button (an NPC's "Change Race") in a two-column grid renders at
		// half the panel's width, which reads as a missing second button.
		const columns = actions.length + actionViews.length === 1 ? 1 : 2;
		const bar = actionGrid(panel(wrap, "Actions"), actions, columns);
		for (const view of actionViews) await dv.view(view, { container: bar });
	}
}
