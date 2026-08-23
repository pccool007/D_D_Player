# _obsi_views

Dataview `dv.view()` files — reusable render logic for notes, ported from the
companion GM vault (`Dungeon_Dragons`) and adapted to this simpler player vault.

Each view is a folder holding one `view.js`. Call it from a `dataviewjs` block:

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/session_table");
```

Inside a callout, every line needs the `> ` prefix:

```
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/manager_aside");
> ```
```

> [!warning] An infobox is one `dv.view()` line, never markdown
> Every `[!infobox]` in this vault holds exactly one call — `manager_aside` for a
> campaign, `note_aside` for everything else — and nothing else. The nine
> templates used to hand-write the same heading, `###### Section` bar and
> `**Label** | =this.field |` table, and the nine copies drifted: Faction lost two
> trailing pipes, Quest went lowercase, Session grew a double-space cell, Lore
> hardcoded its image. Add a row to a schema in `note_aside`, not to a template.
>
> The panel chrome comes from `panels` (`globalThis.DnDPanels`) — `manager_aside`
> and `pc_card` were migrated onto it, so there is exactly one copy. Use
> `panel(wrap, title)` for a card with rows and `header(wrap, text)` for a bare
> title bar: `panel` always hangs a padded body under its header, which reads as
> an empty section when there is nothing to put in it.
>
> `stack()` also tags its column with `.obsi-panel-stack`, which is what lets
> `panels` drop the border ITS Theme draws around `.callout-content`. Without it
> every infobox shows a frame around the frames. Build a stack any other way and
> the double border comes back.

> [!warning] These files must stay OUT of `_obsi_scripts/`
> Templater scans its `user_scripts_folder` recursively and throws on any `.js`
> that has no `module.exports`. View files are bare statements, not modules — put
> one under `_obsi_scripts/` and Templater breaks vault-wide.

## Catalogue

| View | What it renders | Used by |
|---|---|---|
| `panels` | Helper library, not a renderer. Assigns `globalThis.DnDPanels` (`stack`, `panel`, `row`, `textRow`, `linkRow`, `actionButton`, `actionGrid`, `promptTextarea`, `promptSelect`, `openPinned`, `trashIfEmpty`, `notify`, `el`, `list`, `has`, `linkName`, `linkEl`, `appendValue`, `fmtDate`). **The panel look lives here** — a new view must use it rather than growing its own copy. `promptTextarea` is the one-textarea modal and `promptSelect` the one-dropdown one (`title`, `subtitle`, `value`, `cta`, plus `options` for the select; both resolve to the chosen value, or `null` when cancelled) — they share one `modal-*` shell, so a third prompt shape goes in here too rather than hand-rolling a fourth backdrop. `trashIfEmpty(folder)` is what the two moving buttons tidy up with: the folder a note just left, trashed only when the move emptied it (`trashFile`, so the vault's own "Deleted files" setting decides where it goes) — pass the IMMEDIATE former parent, captured before the move. `openPinned(file)` opens a note in reading view and pins its tab, reusing a tab already showing it — **the one copy every view pins through**; `Macro - Open Current Campaign` keeps its own because a Templater module can't rely on this global | `note_aside`, `session_resume`, `npc_race`, `location_move`, `world_pin`, `dashboard` |
| `note_aside` | The `[!infobox]` of every non-campaign note, as stacked panels: title, image, the type's rows, and its action buttons. One schema per `type` inside the file, so the templates pass **no options** | NPC, PC, Quest, Faction, Location, Establishment, Lore, Item, Session |
| `infobox_img` | A note's image field as an embed, or "No {label} image found." Pass `field` (`img` / `npc_img`) and `label`. Renders an `image_upload` button underneath unless `upload: false`. Pass `container` to render inside the caller's layout | `note_aside` |
| `image_upload` | "Set image" button — file picker → copy into `00 - Config/_obsi/assets/{campaign}/` → write the full-path wikilink into `field`. Omit `field` to upload only. Pass `container` when nesting inside a caller's own layout | `infobox_img`, `manager_aside` |
| `action_bar` | A row of buttons that run QuickAdd choices by name (or Obsidian commands with `kind: "cmd"`). Replaced the Buttons-plugin `​```button` fences | quick-capture promote buttons, `README.md` |
| `dashboard` | Helper library, not a renderer. Assigns `globalThis.DnDDash` (`isActive`, `fmtField`, `addRow`, `addRowMixed`, `linkEl`, `appendValue`, `appendRich`, `toFile`, `openCampaign`) | `Dashboard.md`, `campaign_cards` |
| `campaign_cards` | Active-campaign cards — meta chips, next/last session, key events, player chips, consistency bar, Log status, and a small open+pin button top-right. **Styled by `extra.css`** — see *Styling* below | `Dashboard.md` |
| `manager_aside` | Stacked infobox panels — identity, Links, Stats tiles (per-campaign folders, or vault-wide for `kind: "vault"`), grouped Play/World/Items action buttons, an **Open World** button in the World panel (`world_pin`), and an Assets upload button (campaign only). `kind: "campaign" \| "vault"`, `world: false` to drop the Open World button | Campaign Manager, Dashboard |
| `world_pin` | "Open World" button — opens the note in the campaign's `world` property in reading view and pins its tab, reusing a tab already showing it. Greyed out, with the reason on click, when `world` is empty or points at a missing note. `container` to render the button into a caller's own layout, `path` to read `world` off another campaign | `manager_aside` (Campaign Manager) |
| `session_table` | Sessions table, newest `recent` open and the rest folded. Mentioned NPCs/Locations come from outlinks | Campaign Manager |
| `session_hero` | Session banner — number, date, location chips, summary, prev/next links by `session_num` | Session |
| `session_resume` | "Add Resume" button — a modal textarea whose text is written into the session's `[!tldr] … ^summary` callout under *Summary*, quoted and with the block ref kept last. Opens pre-filled, so a second click edits instead of duplicating. `container` to render the button into a caller's own layout | `note_aside` (Session) |
| `npc_race` | "Change Race" button — a dropdown of `IconRegistry`'s creature types that does everything `NPCWizard` does for one: **moves** the note to `World/NPC/{type}` (through `fileManager.renameFile`, so inbound `[[links]]` follow), then writes `race`, `icon`, `iconColor`, and the type's placeholder portrait into `npc_img` — the last one **only when `npc_img` still holds a placeholder**, never over uploaded art. `subRace` is left alone: the player-facing race does not change because the creature type was corrected. The move goes first, so a note that could not move (a name already taken in the target folder) keeps the icon matching where it still is. `container` to render the button into a caller's own layout, `path` for another NPC | `note_aside` (NPC) |
| `location_move` | "Move Location" button — re-parents a location by **moving its folder**, which is what carries the subtree: moving Veilmoria takes `Cities/Amberhall` and Amberhall's `Establishments/` with it, and their own `locations` fields stay correct because their parent did not change. The dropdown offers only legal parents, from `LocationHierarchy`'s rules read backwards (which parents fit this type), minus its own subtree — a folder cannot move inside itself. Then it sets `locations` to exactly the new parent (a location's `locations` IS its hierarchy parent, which is why `withWorld`/`withDimension` skip it) and trashes the tier folder it emptied. `location_type` / `location_tier_level` are never touched. `container` to render the button into a caller's own layout, `path` for another location | `note_aside` (Location) |
| `campaign_quests` | Active / Done quest tables. `status: "active" \| "done"` | Campaign Manager — the folded *Quest done* table, the one place a table still beats cards |
| `quest_cards` | The same quests as a card grid with status pills. `status: "active" \| "done" \| "all"`. Resolves its campaign from `campaigns` frontmatter or the path, so it works in any note under a campaign. **Styled by `extra.css`** | Campaign Manager, Session |
| `pc_roster` | Hero-card grid of PCs. Folder mode (`campaign: true`), frontmatter mode (`field`), or vault-wide (`folder: "01 - Campaigns"`, `showCampaign: true`). **Styled by `extra.css`** — see *Styling* below | Campaign Manager, Session, Dashboard |
| `pc_card` | Stats / Bio / Info / Party panels for one PC. `container` to join a caller's stack. **Styled by `extra.css`** | `note_aside` (PC) |
| `pc_condition_list` | Compact list of PCs matching a `condition` ("dead" / "missing") | Campaign Manager |
| `coin_purse` | Coin mode: pp/gp/sp/cp totalled in gp. Hoard mode (`folder: true`): sums `gold_value` across Inventory | Campaign Manager |
| `table_search` | Searchable, filterable table. Caller supplies `from` / `where` / `headers` / `row`; `requireQuery: true` hides the table until you type or pick a filter | Dashboard, the five table views below |
| `table_kit` | Helper library, not a renderer. Assigns `globalThis.DnDTables` (`slug`, `nameOf`, `arr`, `pill`, `avatar`, `campaignOf`, `linksHere`). **The pill and the avatar live here** — a sixth table view must use them rather than growing its own copy. The avatar's portrait falls back in four steps: the note's own `npc_img`/`img`, then its creature type's `placeholder` from `IconRegistry`, then its `type`'s, then `placeHolderNPCUnknown.png` — so a row is right even for a note whose frontmatter predates the type. `type: player` skips the race step, since a PC's `race` comes from the same creature-type list but their portrait is player art. Placeholders are named by **bare basename**, never a path. This is the only file here that `require()`s a helper, so it is reload-sensitive and the call is try/caught — a registry that fails to load costs a portrait, not five tables | all five table views |
| `npc_table` | Every "List of NPC's" table. Wraps `table_search` — search box, Race/Condition/Relation dropdowns, 10-row cap, Condition and Relation as pills. `link: "locations" \| "factions"` scopes it to NPCs pointing at this note; omit for the whole campaign | Campaign Manager, Location, Establishment, Faction |
| `faction_table` | Every "List of Factions" / "Factions" table. Type/Status dropdowns, both as pills, and a **Leader** avatar. `link: "locations"` scopes it | Campaign Manager, Location |
| `location_table` | Every "Associated Locations" tier callout and the campaign manager's "List of Locations". The tier callouts are search only — they are already narrowed to one type. An **Aliases** column follows Name. `type` keeps a single `location_type`, `excludeTypes` powers the *Other* callout, `showType` adds a Type pill and `typeFilter` a Type dropdown (both campaign manager only, and `typeFilter` defaults to `showType`), `link: "locations"` scopes it | Campaign Manager, Location |
| `establishment_table` | The "Table Shops/Services" callout. Search only; **Owner** avatar and an `establishment_type` pill. `link: "locations"` scopes it | Location |
| `lore_table` | Every "Lores" callout and the campaign manager's "List of Lore". Search + Type dropdown, `lore_type` as a pill. `link: "relations"` scopes it — an NPC, **PC**, faction or location page collects the lore that names it | Campaign Manager, Location, NPC, PC, Faction |

All five table views are **styled by `dnd-tables.css`** and share their helpers
through `table_kit`. Each is little more than a column list, a filter list and a
`where` clause; the behaviour lives in `table_search` and `table_kit`.

> [!warning] `leader` and `owner` are not always links
> Both are metadata-menu **`File`** fields — one value, never a list, so never
> `contains()` them the way `locations` is treated. But the pickers differ
> (`leader` → NPC; `owner` → player, NPC or faction) and `ParseCapture` writes
> **plain free text** into either when a session capture named someone with no
> note. `table_kit`'s `avatar` handles all three shapes plus the empty one; do
> not re-implement it per view.

## Styling

Most views style themselves inline, so they render correctly with no CSS snippet
enabled. The four **card** views are the deliberate exception — `pc_roster`,
`pc_card`, `campaign_cards` and `quest_cards` — joined by the two **table** views,
`npc_table` and `faction_table`: they emit semantic classes and data attributes,
and their look lives in `.obsidian/snippets/`:

| Snippet | Styles | Prefix |
|---|---|---|
| `dnd-tokens.css` | shared `--dnd-*` values — **required by the four below** | — |
| `pc-card.css` | `pc_roster` + `pc_card` | `.pc-*` |
| `campaign-card.css` | `campaign_cards` | `.cc-*` |
| `quest-card.css` | `quest_cards` | `.qc-*` |
| `dnd-tables.css` | `npc_table` **and** `faction_table` — the shared `.dnd-pill` and `.dnd-avatar`, plus each table's image caps | `.dnd-*` |
| `extra.css` | vault-wide odds and ends | — |

One sheet per view is the rule everywhere except `dnd-tables.css`: the pill and
the avatar are genuinely the same component in both tables, and a second verbatim
copy is how two things end up almost, but not quite, alike. A third table view
should reuse `.dnd-pill` / `.dnd-avatar` rather than grow its own.

The four dependent sheets read their borders, radii and status colours from
`dnd-tokens.css` and define no shared values of their own. Order between them
doesn't matter — custom properties resolve where they are used, not where they
are declared — but disabling the token sheet strips all three of their palette.

State is expressed as an attribute or a modifier class; the CSS decides what
colour that state is:

| Attribute / class | Set from | Drives |
|---|---|---|
| `data-pc-class` | first `class:` value, slugged | `--pc-accent` — the class colour |
| `data-pc-condition` | `condition:`, slugged | `--pc-cond` — the badge colour |
| `data-pc-tint` | card index mod 6 | `--pc-tint-a/b` — placeholder portrait gradient |
| `.cc-hero.is-today` | a session dated today | `--cc-tone` — accent → green |
| `data-cc-tone` | consistency %: ≥95 / ≥80 / below | `--cc-tone` — bar + figure colour |
| `data-qc-status` | `quest_status`, slugged | `--qc-tone` — top border, pill, hover |
| `data-npc-condition` | `condition`, slugged | `--dnd-tone` — the Condition pill |
| `data-npc-standing` | `party_standing`, slugged | `--dnd-tone` — the Relation pill |
| `data-faction-status` | `faction_status`, slugged | `--dnd-tone` — the Status pill |
| `data-faction-type` | `faction_type`, slugged | `--dnd-tone` — one hue per category |
| `data-establishment-type` | `establishment_type`, slugged | `--dnd-tone` — one hue per category |
| `data-lore-type` | `lore_type`, slugged | `--dnd-tone` — one hue per category |
| `data-location-type` | `location_type`, slugged | `--dnd-tone` — one hue per category |
| `.dnd-avatar.is-unknown` | an empty `leader` / `owner` | greys the placeholder portrait, mutes *Name Unknown* |

`table_kit`'s `slug` collapses every run of non-alphanumerics, not just
whitespace, so `Commerce & Trade` → `commerce-trade` and `Player_Lore` →
`player-lore` instead of leaking `&` and `_` into selectors. For every value
already in use it matches the older whitespace-only `slug` in `pc_roster` /
`pc_card` / `quest_cards` exactly, so no existing rule shifted.

Consequences worth knowing:

- **The snippets must stay enabled** in `.obsidian/appearance.json` →
  `enabledCssSnippets`. Turn one off and its cards render as bare divs.
- **Add a colour in CSS, not JS** — one line in the relevant palette block. An
  unrecognised class or quest status falls back to a neutral.
- **Hover is CSS**, not JS. `campaign_cards` used to attach a
  mouseenter/mouseleave pair to every button to repaint it; those are gone.
- The only value still pushed from JS is the consistency bar's width, as
  `--cc-pct` — CSS can't derive it.
- The panel *frame* around `pc_card` still comes from `panels`, so a PC's
  infobox keeps matching an NPC's. Only the tiles, rows and colours are CSS.

## Campaign scoping

This vault has no separate Worlds tree — everything a campaign owns lives under
`01 - Campaigns/{campaign}/`. Views that need the campaign resolve it in this
order: an explicit `campaign` option, then the note's `campaign` / `campaigns`
frontmatter link, then the campaign folder in its own path. Pickers are scoped to
that campaign and filtered on the target note's `type`.

Folder names the views assume: `Sessions/`, `PC/`, `Quests/`, `Inventory/`,
`World/NPC/`, `World/Factions/`, `World/Locations/`, `World/Establishments/`,
`World/Lores/`.

`World/Locations/` is a nested folder-note tree, not a flat folder: a location
lives at `{Name}/{Name}.md` with its children in tier subfolders below it, and its
establishments in its own `Establishments/` subfolder (`World/Establishments/` only
holds establishments with no parent location). Queries that span locations or
establishments must therefore scan `01 - Campaigns/{campaign}/World` and filter on
`type` — not a single fixed folder.

## Not ported

Three GM-vault views depend on plugins this vault doesn't have, so they were left
out rather than shipped broken: `calendarium_current` and `calendarium_date`
(Calendarium), plus the Dashboard's Activity Heatmap (heatmap-calendar) and
`tasks` block (Tasks). `table_roller`, `shipyard_table`, `spell_slots` and
`session_preps` have no player-vault equivalent (roll tables, ships, spell slots,
GM prep notes).
