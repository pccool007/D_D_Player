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

> [!warning] These files must stay OUT of `_obsi_scripts/`
> Templater scans its `user_scripts_folder` recursively and throws on any `.js`
> that has no `module.exports`. View files are bare statements, not modules — put
> one under `_obsi_scripts/` and Templater breaks vault-wide.

## Catalogue

| View | What it renders | Used by |
|---|---|---|
| `infobox_img` | A note's image field as an embed, or "No {label} image found." Pass `field` (`img` / `npc_img`) and `label`. Renders an `image_upload` button underneath unless `upload: false` | every note type with a portrait |
| `image_upload` | "Set image" button — file picker → copy into `00 - Config/_obsi/assets/{campaign}/` → write the full-path wikilink into `field`. Omit `field` to upload only. Pass `container` when nesting inside a caller's own layout | `infobox_img`, `manager_aside` |
| `action_bar` | A row of buttons that run QuickAdd choices by name (or Obsidian commands with `kind: "cmd"`). Replaced the Buttons-plugin `​```button` fences | everywhere |
| `dashboard` | Helper library, not a renderer. Assigns `globalThis.DnDDash` (`isActive`, `fmtField`, `addRow`, `addRowMixed`, `linkEl`, `appendValue`, `appendRich`, `toFile`, `openCampaign`) | `Dashboard.md`, `campaign_cards` |
| `campaign_cards` | Active-campaign cards — meta chips, next/last session, key events, player chips, consistency bar, Housekeeping/Log status, and a small open+pin button top-right | `Dashboard.md` |
| `manager_aside` | Stacked infobox panels — identity, Links, 9 Stats tiles, grouped Play/World/Items action buttons, and an Assets upload button (campaign only). `kind: "campaign" \| "vault"` | Campaign Manager, Dashboard |
| `session_table` | Sessions table, newest `recent` open and the rest folded. Mentioned NPCs/Locations come from outlinks | Campaign Manager |
| `session_hero` | Session banner — number, date, location chips, summary, prev/next links by `session_num` | Session |
| `campaign_quests` | Active / Done quest tables. `status: "active" \| "done"` | Campaign Manager, Session |
| `quest_cards` | The same quests as a card grid with status pills. `status: "active" \| "done" \| "all"` | Campaign Manager |
| `pc_roster` | Hero-card grid of PCs. Folder mode (`campaign: true`), frontmatter mode (`field`), or vault-wide (`folder: "01 - Campaigns"`, `showCampaign: true`) | Campaign Manager, Session, Dashboard |
| `pc_card` | Stats / Bio / Info / Party panels for one PC | PC |
| `pc_condition_list` | Compact list of PCs matching a `condition` ("dead" / "missing") | Campaign Manager |
| `coin_purse` | Coin mode: pp/gp/sp/cp totalled in gp. Hoard mode (`folder: true`): sums `gold_value` across Inventory | Campaign Manager |
| `table_search` | Searchable, filterable table. Caller supplies `from` / `where` / `headers` / `row`; `requireQuery: true` hides the table until you type or pick a filter | Dashboard |

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
