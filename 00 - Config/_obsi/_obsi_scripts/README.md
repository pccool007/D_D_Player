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
| `GetWorldName` | Resolves the world name from the campaign's `world` frontmatter |
| `GetThisGameNum` | Returns the zero-padded session number (e.g. `003`) |
| `GetLastGameTitle` | Returns the previous session's title, for the recap embeds |
| `IconRegistry` | Single source of truth for every wizard's type → `icon`/`iconColor` table. `iconRegistry(domain)` with domain ∈ `npc`/`faction`/`establishment`/`location`/`lore`/`quest`/`inventory`/`pc`. Wizards `require()` it by absolute path — **edit icons here, never in a wizard.** Key order drives suggester option order; edits need an Obsidian reload (Node's `require()` cache) |
| `FormPrompt` | One modal that asks several questions at once — text / `date` / `number` / `url` / `select` fields, required-field validation, Enter to save. QuickAdd's own API is one prompt at a time and text-only, so this is what gives `CampaignWizard` a real date picker. `require()`d by absolute path like `MultiSelectPrompt` |
| `LocationHierarchy` | The nesting rules shared by both location wizards: `tierOf(frontmatter, categories)`, `allowedChildTypes(categories, parentTier)`, `folderUnderParent(parentFolder, picked)`, `folderAtCampaignRoot(campaignRoot, picked)`. Called as `_obsi_script_LocationHierarchy()` — it returns the API object |

## Resolvers

| Script | What it does |
|---|---|
| `SetParamsInCapGetCampaignFolder` | Sets `folderName` to `01 - Campaigns/{campaign}` |
| `GetThisSessionName` | Sets `thisGameFilename` (`003_20240315`) + `folderName` |
| `GetCurrentFolderPath` | Sets `folderName` to the active file's parent |

## Wizards

Every wizard prompts for a name first, sets `variables.fileName` (which drives
the note's filename via the macro's `{{VALUE:fileName}}` format), and reads its
icon from `IconRegistry`. Cancelling any prompt sets `variables.cancelled`.

> [!warning] `suggester` takes the question as its **3rd** argument
> `quickAddApi.suggester(displayItems, actualItems, placeholder, fromInsertMultipleChoice, opts)`.
> Passing `undefined` in the 3rd slot and the question in the 4th (a plausible-looking
> mistake) shows a suggester with **no question at all** and silently flips the
> multiple-choice flag, because a non-empty string is truthy. Always:
> `suggester(labels, values, "Location type?")`.

| Script | Prompts | Sets |
|---|---|---|
| `CampaignWizard` | a single `FormPrompt` form: campaign name, world name, campaign start (date picker), D&D Beyond URL, session cadence (1–4 weeks) | `fileName`, `folderName`, `world`, `campaign_start`, `dndbeyond_url`, `recurrence`, plus `worldFileName` / `worldFolderName` / `icon` / `location_type` / `location_tier_level` / `locations` for the world note |
| `LocationWizard` | name, has a parent? → parent location, then type (only tiers deeper than that parent) | `icon`, `location_type`, `location_tier_level`, `locations`, `folderName` |
| `SelectLocationTypeAndFolder` | name, parent location (active note / another / none), then type (only tiers deeper than that parent) | `icon`, `location_type`, `location_tier_level`, `locations`, `folderName` |
| `EstablishmentWizard` | name, category (8), parent location | `icon`, `establishment_type`, `locations`, `folderName` |
| `NPCWizard` | name, creature type (14), where met | `icon`, `iconColor`, `race`, `locations` |
| `FactionWizard` | name, faction type (5), parent faction | `icon`, `iconColor`, `faction_type`, `parent_faction` |
| `LoreWizard` | name, lore type (7), related lore (Player_Lore only) | `icon`, `iconColor`, `lore_type`, `relations` |
| `QuestWizard` | name, reward, owner, location | `icon`, `iconColor`, `quest_status`, `reward`, `owner`, `locations` |
| `InventoryWizard` | name, item type (9), gold value, owner | `icon`, `iconColor`, `item_type`, `gold_value`, `owner` |
| `PCWizard` | name, class (14), player, race | `icon`, `iconColor`, `class`, `player`, `race` |

`CampaignWizard` is the exception to "prompts for a name first": it asks everything
in one form. It is also the only wizard whose macro creates **two** notes —
`Macro - Create Campaign` runs the wizard, then the campaign manager
(`01 - Campaigns/{Campaign}/{Campaign}.md`), then its main world as a tier-0
Dimension location (`…/World/Locations/Dimensions/{World}/{World}.md`), so every
continent and region can nest inside it. Cancelling the form `throw`s the string
`"cancelled"` — the only thing QuickAdd honours as "abort this macro"; setting
`variables.cancelled` alone would let the template steps run on empty values.

The parent/owner/location pickers are all scoped to the current campaign
(`variables.folderName`) and filtered by the target note's `type` frontmatter.
Each offers a `— Skip —` option and leaves the field empty when skipped.

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
- **Without a parent**: `World/Locations/{location_type}/{Name}/{Name}.md`
- **Establishment** (`Macro - Add Establishment`): `{parent location folder}/Establishments/{Name}.md`,
  or `World/Establishments/` when no parent location is chosen

Both location macros write to `{{VALUE:folderName}}` alone — the wizard computes the
full destination, so the folder format in QuickAdd must not append anything.

**Parent is always asked before type.** A child must sit at a strictly deeper tier
than its parent, so the parent's tier is what filters the type suggester: a City
accepts no tiered children, only environments. Untiered environments may nest
anywhere, and with no parent every type is offered.

## Macros

Standalone scripts that read or modify *existing* notes — no template step.

| Script | What it does |
|---|---|
| `OpenCurrentCampaign` | Opens + pins the campaign you're playing, in reading view. "Current" = the campaign with a session dated today, else the only Active one, else a suggester. Pins today's session alongside it when there is one |

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
| `icon` / `iconColor` | every distinct value across all domains |

**Change a wizard's options only by editing `IconRegistry`, then regenerate these
presets** — otherwise the dropdown offers values no wizard writes (and vice
versa), which is exactly how `faction_type`, `lore_type`, `quest_status` and
`location_type` drifted before.

The link-typed presets (`locations`, `first_location`, `last_seen`, `factions`)
are campaign-scoped `dvQueryString` lookups: they read segment `[1]` of the
current note's path to find its campaign, then filter on the target's `type`.
`locations` and `factions` are `MultiFile`; `first_location` and `last_seen` are
single-value `File`.

## Not scripts: `_obsi_views/`

Dataview `dv.view()` files live in **`00 - Config/_obsi/_obsi_views/`**, *outside*
this folder — deliberately. Templater scans `user_scripts_folder` recursively and
errors on any `.js` without `module.exports`, which view files don't have. Keep
them separate.

See `_obsi_views/README.md` for the catalogue.
