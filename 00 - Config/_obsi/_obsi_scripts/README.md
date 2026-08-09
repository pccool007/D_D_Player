# D_D_Obsidian_Scripts

Scripts are organized into subfolders by role — the same taxonomy as the
companion GM vault (`Dungeon_Dragons`):

- **`Helpers/`** — pure getters; return a value with no UI; called in templates as `tp.user.X`
- **`Resolvers/`** — QuickAdd "User Script" steps that set `variables.folderName` / `variables.fileName`
- **`Wizards/`** — interactive multi-prompt scripts that seed template variables
- **`Macros/`** — standalone scripts that read or modify existing notes (no template step)

Templater scans `user_scripts_folder` recursively, so `Helpers/` callees are
auto-discovered by name regardless of subfolder. QuickAdd, by contrast,
references `Resolvers/` and `Wizards/` scripts by **full path** in
`.obsidian/plugins/quickadd/data.json` — moving one means updating that path.

## Helpers

| Script | What it does |
|---|---|
| `GetFileRacine` | Returns the campaign name from the file path |
| `getFileRacineForProperties` | Same, formatted as a wiki-link for frontmatter |
| `GetCampaignFolderName` | Returns `01 - Campaigns/{name}/{subFolder}` |
| `GetWorldName` | Resolves the world name from the campaign's `world` frontmatter. Also exports `bareWorldName` as a property, so `WizardForm` unwraps `"[[Soltpeak]]"` the same way instead of carrying a second copy of the regex |
| `GetThisGameNum` | Returns the zero-padded session number (e.g. `003`) |
| `GetLastGameTitle` | Path (minus `.md`) of the previous session, for `Template_Session`'s recap embeds. Sorts on `session_num` and excludes the current note **by path** — not by taking the second-to-last entry, which assumed Dataview's index had already caught up with the note being created. Returns `""` when there is no previous session, and the template omits the embeds rather than emitting four broken ones |
| `CaptureSpecs` | The render+parse contract shared by every quick capture: one spec per domain giving the capture's field lines, their hints, and the `- [ ] Promote to World {Type}` box that `ParseCapture` finds them by. `specs.render()` writes a block, `specs.parse()` reads one back — keep them symmetric or promote stops finding fields. A field is found **by its label**, so renaming one orphans every capture already written: give it `aliases: ["OldLabel"]` instead, as the faction's `Locations` carries `HQ` |
| `MultiSelectPrompt` | The checkbox picker every multi-value field opens: filter box, click to toggle, `Alt+Enter` to save, `null` on cancel. `FormPrompt` loads it lazily and stacks it over the form, so it is reached through a `multi` row rather than called directly. Hand-rolled for the same reason as `FormPrompt`: `require("obsidian")` does not resolve inside a QuickAdd script, so the modal is built from raw DOM |
| `IconRegistry` | Single source of truth for every wizard's type → `icon`/`iconColor` table. `iconRegistry(domain)` with domain ∈ `npc`/`faction`/`establishment`/`location`/`lore`/`quest`/`inventory`/`pc`. Wizards reach it through `WizardForm` — **edit icons here, never in a wizard.** The `npc` domain carries a third key, `placeholder`: the creature type's default portrait, on the same never-a-free-choice rule as its icon. It is a **bare basename** in `assetsDefault/` with the extension included (`Unknown` is a `.png`, the other fourteen `.jpg`) — never build one by appending `.jpg`. `table_kit` reads the same key at render time. Key order drives dropdown option order; edits need an Obsidian reload (Node's `require()` cache) |
| `FormPrompt` | One modal that asks every question at once — the shape **every** wizard in the vault uses. Field types `text` / `date` / `number` / `url` / `select` / `multi`, required-field validation, Enter to save. Three things beyond a plain form: `multi` is a **button** summarising the choice (the one name, else `N selected`) that opens `MultiSelectPrompt` over the form and returns an array; `disabled` greys a row and yields `""`, which is how a picker with nothing to offer stays visible instead of vanishing; and `dependsOn` + `optionsFor`/`describe` let a `select` or `multi` rebuild itself from another field's value — how the location form gates types by the parent's tier, and how every wizard narrows its pickers to the chosen dimension. Chains work: a rebuilt select that lands on a *different* value notifies its own dependants, which is what keeps `dimension → parent → type` in step. `require()`d by absolute path |
| `WizardForm` | The plumbing every "Add …" wizard shares, as `_obsi_script_WizardForm(params)`: `campaignRoot()` (validated — see below), `notesOf(root, types)`, `worldName(root)` / `withWorld(root, names)`, the dimension half `dimensionsIn` / `dimensionField` / `dimensionScope` / `dimensionOf` / `withDimension` (see below), the two picker field builders `noteField` / `noteMultiField`, `typeField`/`styleFor`/`typesIn` over `IconRegistry`, and the YAML shapes `link()` / `yamlList()` / `plain()`. It is why the wizards are now ~60 lines of field list and variable mapping each |
| `LocationForm` | The location form itself, shared by both location wizards — name, **dimension**, parent scoped to that dimension, and a type list that rebuilds as the parent changes. Takes `{ preferActiveAsParent }`, which is the *only* difference between "Add Location" and "Add Location (Child)" |
| `LocationHierarchy` | The nesting rules shared by both location wizards: `tierOf(frontmatter, categories)`, `allowedChildTypes(categories, parentTier)`, `bucketFor(picked)`, `folderUnderParent(parentFolder, picked)`, `folderAtCampaignRoot(campaignRoot, picked)`. Called as `_obsi_script_LocationHierarchy()` — it returns the API object. **`bucketFor` is the only place a category's folder is decided** — both folder functions go through it, because they once disagreed and put the same City in `Cities/` with a parent and `City/` without one |

> [!warning] There is exactly **one** way to ask for several things
> Always a `FormPrompt` `multi` row — `WizardForm.noteMultiField` for notes, a bare
> `{ type: "multi", options }` for a fixed list. Never an inline checkbox list (it
> grows the modal without bound), never a second modal after the form settles (a
> prompt chain wearing a form's clothes), never `quickAddApi.checkboxPrompt`.
> **`FormPrompt` is the only file that may `require` `MultiSelectPrompt`**;
> `SMOKE_TEST.md` greps for anything else that does.
>
> The template decides which fields qualify, not taste: a `{{VALUE:x}}` slot holding
> a **YAML list** takes several. The exceptions are list slots that also drive a
> **folder** (a location's, establishment's or faction's parent) and an NPC's
> `locations`, written from the same answer as the scalar `first_location` /
> `last_seen`. Those are structurally single — the **answer** is, at least. The
> written list may still be longer, because `withDimension` prepends the chosen dimension
> to it; that is not an answer and never gets a picker row.

> [!warning] A modal stacked on a modal must **suspend** the one underneath
> Both hand-rolled modals listen for keys on `document` in the capture phase, so a
> key pressed in the picker reaches the form under it too — `Esc` would close the
> picker *and* cancel the whole wizard, `Enter` would save the form behind your back.
> `FormPrompt` keeps a `suspended` counter that a row increments before it opens
> anything on top and decrements in a `finally`; while it is non-zero the form
> ignores its keyboard handler, its Save and its Cancel. Anything that opens a
> second modal from a form row has to go through `host.suspend()` / `host.resume()`
> for the same reason.

## Resolvers

| Script | What it does |
|---|---|
| `SetParamsInCapGetCampaignFolder` | Sets `folderName` to `01 - Campaigns/{campaign}` |
| `GetThisSessionName` | Sets `thisGameFilename` (`003_20240315`) + `folderName` |
| `ParseCapture` | The promote engine. Reads a quick capture out of the active session note and sets every variable the matching `Template_*.md` needs, resolving plain names to real notes. Takes a domain argument, so it is **not** a QuickAdd step itself — the four one-line wrappers `ParseNPCCapture` / `ParseFactionCapture` / `ParseLocationCapture` / `ParseEstablishmentCapture` are what QuickAdd calls, since a UserScript step takes no arguments. Also records `capture_source_path` / `capture_block_index` so `MarkCapturePromoted` can find the block afterwards. Loads `WizardForm` for one thing only — `withWorld`, so a promoted note carries the same campaign world in `locations` that the matching "Add …" wizard puts there |

## Wizards

Every wizard asks **one `FormPrompt` form** — never a chain of prompts — then sets
`variables.fileName` (which drives the note's filename via the macro's
`{{VALUE:fileName}}` format) and reads its icon from `IconRegistry`. The shared
parts live in `Helpers/_obsi_script_WizardForm.js`; a wizard is a field list plus
the mapping from answers onto `variables`.

QuickAdd only prompts for a `{{VALUE:x}}` it cannot find in that map, so **every
variable a template names has to be set on every path that expands it** — which is
why the wizards assign blanks for fields only the promote path fills. `Template_NPC`'s
`npcImg` is the one with two writers: `NPCWizard` and `ParseCapture` both set it from
the creature type's `placeholder`, and dropping either turns a portrait into a prompt.

Three habits the form makes possible, and that new wizards should keep:

- **Nothing to pick is still a row.** `noteField` renders a disabled row carrying
  its `emptyHint` ("No faction in this campaign yet") rather than dropping the
  field, so the form does not silently change shape between campaigns.
- **Dropdowns always have a value.** A suggester could be escaped past; a `select`
  cannot. Give type fields a sensible default — `Unknown` for an NPC's creature
  type, `Other` for a PC's class — because whatever is first in the registry is
  otherwise the answer.
- **Refuse a bogus campaign root.** `SetParamsInCapGetCampaignFolder` takes path
  segment `[1]` of the active note without checking it, so a button clicked from
  `Dashboard.md` yields the *truthy* string `01 - Campaigns/undefined`. Every
  wizard calls `form.campaignRoot()` and cancels with a Notice when it comes back
  null — an `if (!campaignRoot) return` guard does not catch this.

> [!warning] Cancelling must **throw**, not return
> Every wizard declares `const cancel = () => { variables.cancelled = true; throw "cancelled"; }`
> and calls it on every abort path. The `throw` is the load-bearing part: it is the
> only thing QuickAdd honours as "abort this macro". Setting `variables.cancelled`
> and returning lets the macro's template step run on and write a note out of empty
> values — which is exactly what `Esc` used to do in nine of the ten wizards.

> [!warning] `suggester` takes the question as its **3rd** argument
> `quickAddApi.suggester(displayItems, actualItems, placeholder, fromInsertMultipleChoice, opts)`.
> Passing `undefined` in the 3rd slot and the question in the 4th (a plausible-looking
> mistake) shows a suggester with **no question at all** and silently flips the
> multiple-choice flag, because a non-empty string is truthy. Always:
> `suggester(labels, values, "Location type?")`. No wizard uses it any more — the
> forms replaced every one — but `ParseCapture` still picks between captures with it.

| Script | Form fields | Sets |
|---|---|---|
| `CampaignWizard` | campaign name, world name, campaign start (date picker), D&D Beyond URL, session cadence (1–4 weeks) | `fileName`, `folderName`, `world`, `campaign_start`, `dndbeyond_url`, `recurrence`, plus `worldFileName` / `worldFolderName` / `icon` / `location_type` / `location_tier_level` / `locations` for the world note |
| `LocationWizard` | name, parent location, type — **the type list rebuilds as the parent changes** (only tiers deeper than it). A wrapper over `LocationForm` | `icon`, `location_type`, `location_tier_level`, `locations`, `folderName` |
| `SelectLocationTypeAndFolder` | the same form, with the active note pre-selected as the parent. Also a wrapper over `LocationForm` | as above |
| `EstablishmentWizard` | name, category (8), parent location (defaults to the active note when it is a location), owner (NPC) | `icon`, `establishment_type`, `locations` (**+ world**), `owner`, `folderName` |
| `NPCWizard` | name, creature type (15, default `Unknown`), gender, where met, factions (picker button) | `icon`, `iconColor`, `race`, `gender`, `locations` (**+ world**), `first_location`, `last_seen`, `factions` |
| `FactionWizard` | name, faction type (5), parent faction, leader, locations (picker button — a faction rarely holds one place; the world is **not** offered) | `icon`, `iconColor`, `faction_type`, `parent_faction`, `leader`, `locations` (**+ world**), `folderName` |
| `LoreWizard` | name, lore type (7), related lore (picker button) | `icon`, `iconColor`, `lore_type`, `relations`, `locations` (**the world alone** — not asked for) |
| `QuestWizard` | name, reward, owner, locations (picker button; the world is **not** offered) | `icon`, `iconColor`, `quest_status`, `reward`, `owner`, `locations` (**+ world**) |
| `InventoryWizard` | name, item type (9), gold value (number), owner | `icon`, `iconColor`, `item_type`, `gold_value`, `owner` |
| `PCWizard` | name, class (14, default `Other`), player, race (the **same** `iconRegistry("npc")` list `NPCWizard` offers, default `Unknown`) | `icon`, `iconColor`, `class`, `player`, `race` |
| `CaptureWizard` | Templater-side, not QuickAdd. Backs all four `ctrl+G` quick-capture notes: **one** `FormPrompt` per domain — multi-value rows are `multi` buttons like everywhere else — then renders the capture block via `CaptureSpecs` | returns the block text — sets no `variables` |
| `SendingWizard` | Templater-side. A hand-rolled modal with a live 25-word counter for *sending* spells | returns the message block |

Every wizard also sets the frontmatter the promote parser fills from a capture
(`subRace`, `age`, `occupation`, `leader`, `terrain`, `goal`, `description`,
`word_description`, `emblem_description`) to `""`. They are not asked on the button
path, but an **unset** `{{VALUE:x}}` makes QuickAdd stop and prompt for it.
Where a wizard *does* ask — `FactionWizard` now offers `leader` — the assignment
must stay, just with a real value: `form.link()` returns `""` on a skipped picker,
so the guarantee holds. Deleting the line is what breaks it, not replacing it.

`CampaignWizard` is the only wizard whose macro creates **two** notes —
`Macro - Create Campaign` runs the wizard, then the campaign manager
(`01 - Campaigns/{Campaign}/{Campaign}.md`), then its main world as a tier-0
Dimension location (`…/World/Locations/Dimensions/{World}/{World}.md`), so every
continent and region can nest inside it.

The parent/owner/location pickers all come from `WizardForm.notesOf`: scoped to the
current campaign (`variables.folderName`) and filtered by the target note's `type`
frontmatter. Each offers a `— Skip —` option and leaves the field empty when
skipped; with nothing to offer at all, the row is disabled rather than absent.

### Every wizard asks which dimension first

A world is not one place. Soltpeak spans ten tier-0 `Dimension` notes, so **every wizard
that touches locations opens with a `Dimension` row**, built by
`WizardForm.dimensionField({ root })`:

- Its options are the campaign's dimensions and nothing else — `dimensionsIn(root)`,
  which means `location_type: Dimension` **or** `location_tier_level: 0`. That check
  guards an empty tier explicitly, because `Number(null)` is `0` and would otherwise
  promote every location with a blank tier to a dimension.
- It **defaults to the campaign world**, so a one-world campaign never has to touch it.
  Launched from inside a dimension (`Add Location (Child)`, an establishment's button),
  it defaults to *that* dimension instead — `dimensionOf(dims, file)`.
- It **narrows every location picker in the same form** to that dimension's subtree, via
  `dependsOn: "dimension"` + `optionsFor`. Scoping is by folder path
  (`dimensionScope(dims)`): locations are folder notes, so a dimension's subtree is
  simply everything under its folder — child locations, and the `Establishments/` folders
  nested inside them.

`WizardForm.withDimension(root, dimension, names)` then puts the chosen dimension at the
front of the `locations` list of every **NPC, Faction, Quest, Establishment and Lore**
note, whatever else was picked. An NPC met nowhere in particular still has a home. It is
deduplicated, and it falls back to `withWorld` when no dimension was picked or the
campaign has none — so a campaign that was never split into dimensions behaves exactly
as it did before.

Three rules follow, and all are load-bearing:

- **A location's own `locations` is exempt.** That field is its hierarchy *parent* and
  decides its folder — `LocationForm` and `ParseCapture`'s `location` branch must never
  call `withDimension` or `withWorld`.
- **The dimension is not offered in the pickers that force it.** `FactionWizard` and
  `QuestWizard` drop it from their own `places` options, because a tickable row that
  changes nothing either way is a lie. The single-value selects — an NPC's "where met",
  an establishment's parent — *do* still offer it; there it is a real answer, and
  `withDimension` dedupes.
- **`LocationForm` leads the parent list with the dimension itself** rather than a
  `— Skip —` row, so `parent` is never empty and the reactive type row always has a real
  tier to gate on. Its dimension row therefore carries an extra `— None (top level) —`
  option: nothing nests at tier 0 under a tier-0 parent, so stepping outside every
  dimension is the only way to create a new one.

`withWorld` survives underneath for that fallback and for `ParseCapture`. It adds nothing
when the campaign root is bogus, when the manager note has no `world`, or when no
`type: location` note of that name exists — a renamed or missing world must not seed a
broken link into every note made afterwards.

### Locations are a folder-note hierarchy

Every location is a **folder note** — `{Name}/{Name}.md` — so children can nest
inside it. `location_tier_level` (from `IconRegistry`) is the depth, and it decides
both the containing folder and which children are legal:

| tier | type | child folder |
|---|---|---|
| 0 | Dimension | `Dimensions/` |
| 1 | Continent | `Continents/` |
| 2 | Region | `Regions/` |
| 3 | Country | `Countries/` |
| 4 | State, **Island** (own `Island/` folder) | `States/` |
| 5 | City | `Cities/` |
| — | Forest, Water, Mountain, Dungeon | folder named after the type |

- **With a parent** (either macro): `{parent folder}/{child folder}/{Name}/{Name}.md`
- **Without a parent**: `World/Locations/{child folder}/{Name}/{Name}.md` — the *same*
  folder it would get under a parent (via `bucketFor`), so a City is always in `Cities/`
- **Establishment** (`Macro - Add Establishment`): `{parent location folder}/Establishments/{Name}.md`,
  or `World/Establishments/` when no parent location is chosen

Both location macros write to `{{VALUE:folderName}}` alone — the wizard computes the
full destination, so the folder format in QuickAdd must not append anything.

**Parent sits above type in the form, and drives it.** A child must sit at a
strictly deeper tier than its parent, so the parent's tier filters the type list —
which `FormPrompt` rebuilds on every change of the parent dropdown, via
`dependsOn: "parent"`. A City accepts no tiered children, only environments — and
since environments are untiered they may nest anywhere, so with the current registry
no parent is ever left with an empty list. The "nothing can nest here" branch is
defensive: add a tiered-only registry and it starts firing, disabling the type row
with the reason on it. With no parent, every type is offered.

## Macros

Standalone scripts that read or modify *existing* notes — no template step.

| Script | What it does |
|---|---|
| `OpenCurrentCampaign` | Opens + pins the campaign you're playing, in reading view. "Current" = the campaign with a session dated today, else the only Active one, else a suggester. Pins today's session alongside it when there is one |
| `MarkCapturePromoted` | Runs at the end of a promote: ticks the capture's `- [ ] Promote to World {Type}` box, appends `→ [[Name]]` so the session note records where it went, and removes the now-dead promote button. Finds the block via the `capture_source_path` / `capture_block_index` that `ParseCapture` recorded |
| `FixFrontmatterUrls` | Vault-wide repair pass for `url`-typed frontmatter broken by a wrapped paste (a newline landing mid-URL). Idempotent — safe to re-run |

## Filtering on `type` in a Dataview query

**Always `WHERE lower(type) = "npc"`. Never `contains(type, "NPC")`.**

`type` is now **lowercase everywhere** — `location` / `npc` / `faction` / `player` /
`quest` / `lore` / `inventory` / `establishment` / `campaign` / `session` /
`dashboard` — in every template and every existing note. Keep new templates
lowercase too.

`lower()` stays anyway, because `contains()` is case-sensitive and the casing used
to be mixed: capitalised for `Location` / `NPC` / `Faction` / `Player` / `Quest` /
`Lore` / `Inventory` / `Establishment`, lowercase for the rest. Three competing
idioms were in use, and two of them were simply
wrong: every location note queried `contains(type,"faction")` and
`contains(type,"quest")` against notes declaring `Faction` and `Quest`, so
*Associated Factions* and *Associated Quest* rendered **empty forever** with no
error to notice.

`lower(type) = "…"` cannot fail that way, so it is the only form used now. Keep it
that way when adding a query, and remember `type` is a single string — `contains`
was never the right operator for it anyway.

## IconRegistry is also the source for the metadata-menu dropdowns

`.obsidian/plugins/metadata-menu/data.json` holds `presetFields` — the dropdowns
you get when editing frontmatter. The enum ones are **generated from
`IconRegistry`**, so a field's options are exactly the values its wizard can write:

| Preset | Comes from |
|---|---|
| `race` | `iconRegistry("npc")` keys — the 14 creature types plus `Unknown` |
| `faction_type` | `iconRegistry("faction")` |
| `establishment_type` | `iconRegistry("establishment")` |
| `location_type` | `iconRegistry("location")` |
| `lore_type` | `iconRegistry("lore")` |
| `quest_status` | `iconRegistry("quest")` |
| `item_type` | `iconRegistry("inventory")` |
| `class` | `iconRegistry("pc")` — the 13 5e classes plus `Other`, shared by PC and NPC |
| `icon` / `iconColor` | every distinct value across all domains |

**Change a wizard's options only by editing `IconRegistry`, then regenerate these
presets** — otherwise the dropdown offers values no wizard writes (and vice
versa), which is exactly how `faction_type`, `lore_type`, `quest_status` and
`location_type` drifted before.

`faction_status`, `alignment` and `sexuality` are the exception: no wizard writes
them, so they have no `IconRegistry` counterpart and their value lists live only
in `presetFields`. Edit them there.

The link-typed presets are campaign-scoped `dvQueryString` lookups: they read
segment `[1]` of the current note's path to find its campaign, then filter on the
target's `type`. `locations` and `factions` are `MultiFile`; the rest are
single-value `File`.

| Preset | Offers |
|---|---|
| `locations` | `location` + `establishment` |
| `factions` | `faction` |
| `first_location` / `last_seen` | `location` + `establishment` |
| `parent_faction` | `faction`, minus the current note |
| `leader` | `npc` — serves both Faction and Location notes |
| `owner` | `player`, then `npc`, then `faction` — serves Establishment, Quest and Inventory |

**`customSorting` is not what the settings UI implies.** metadata-menu evaluates it
as ``new Function("a", "b", `return ${customSorting}`)`` over **`TFile`** objects,
not Dataview pages — so the body must be a bare *expression* returning a number
(`a.basename.localeCompare(b.basename)`), never an arrow function, and there is no
`a.file` or frontmatter on the argument. Writing `(a, b) => …` returns a function,
which `Array.sort` coerces to `NaN` and silently ignores; all four original link
presets were sorted that way and were effectively unsorted. `owner` reaches
frontmatter through `globalThis.app.metadataCache.getFileCache(f)` to rank players
above NPCs above factions. `customRendering`, by contrast, *does* get a Dataview
page — `page.name || page.file.name` is correct there.

## Not scripts: `_obsi_views/`

Dataview `dv.view()` files live in **`00 - Config/_obsi/_obsi_views/`**, *outside*
this folder — deliberately. Templater scans `user_scripts_folder` recursively and
errors on any `.js` without `module.exports`, which view files don't have. Keep
them separate.

See `_obsi_views/README.md` for the catalogue.
