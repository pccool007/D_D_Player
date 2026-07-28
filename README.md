# How to use this vault

Welcome. This is an Obsidian vault built for taking notes as a **player** in a tabletop RPG (5e by
default). Everything here exists so you can write during a session without stopping to think about
where a note goes: you press a button, answer a few questions, and the vault files it, links it and
indexes it for you.

Useful reading if Obsidian itself is new to you:

- https://obsidian.md/
- https://help.obsidian.md/syntax

---

## The layout

Two top-level folders, numbered so they always sort the same way:

| Folder | What's in it |
|---|---|
| `00 - Config` | The machinery — templates, quick-capture notes, scripts, views, placeholder images. You rarely open this. |
| `01 - Campaigns` | Your actual notes. One subfolder per campaign, and everything that campaign owns lives inside it. |

Inside a campaign (`01 - Campaigns/{Campaign}/`):

```
{Campaign}.md          ← the campaign manager (your home base for this campaign)
Sessions/              ← 001_20250912.md, 002_…
PC/                    ← player characters (yours and the rest of the party)
Quests/
Inventory/
World/
  NPC/{CreatureType}/   ← NPCs, filed by creature type
  Factions/             ← + Factions/sub-factions/{Parent}/ for child factions
  Locations/            ← a nested tree, see below
  Establishments/       ← only shops with no parent location; the rest live under their location
  Lores/
```

Also at the root: **`Dashboard.md`** (opens automatically on startup — the vault-wide home) and
**`Cheat Cheat.md`** (the location icon table).

## Where you act from

There are three notes you'll live in, and each one has its own set of buttons:

- **`Dashboard`** — vault-wide. Counts per note type, a search-everything table, cards for your
  active campaigns, your characters across all campaigns, and the `New Campaign` button.
- **The campaign manager** (`{Campaign}.md`) — everything for one campaign: the party, sessions,
  quests, and index tables for NPCs / factions / locations / lore / inventory. The infobox on the
  right holds the full set of `New …` buttons grouped as **Play**, **World** and **Items**.
- **The session note** — where you write while playing. It carries a compact button row so you can
  create an NPC or a location mid-session without leaving the note.

There is also a command **`Macro - Open Current Campaign`** (via `ctrl + o`) that opens and pins the
campaign you're playing right now — it picks the campaign with a session dated today, otherwise your
only Active one, otherwise it asks.

> [!warning]
> Before clicking any button in the vault, make sure **nothing is selected** in the note. Obsidian
> hands the selection to the button as its input, so a stray selection ends up as your note's name.

---

## 1. Create your campaign

From the [[Dashboard]], click `New Campaign` — or this one:

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/action_bar", { actions: [
  ["Add New Campaign", "Macro - Create Campaign", "#56606e"],
] });
```

You get a **single form** asking for everything at once:

| Field | Notes |
|---|---|
| Campaign name | Becomes the folder and the manager note |
| World name | The top-level location of your setting (e.g. `Toril`, `Solstpeak`) |
| Campaign start | Real-world date picker |
| D&D Beyond URL | Optional shortcut to the campaign page |
| Session cadence | Weekly → every 4 weeks |

Press `Esc` to abort — nothing gets created.

The wizard then makes **two** notes: the campaign manager, and your world as a tier-0 **Dimension**
location at `World/Locations/Dimension/{World}/{World}.md`. The manager's `world` property is
filled in for you — you no longer have to link it by hand.

![[Pasted image 20250912092829.png]]

That side tab is your campaign dashboard. At the top are its properties:

![[Pasted image 20250912093026.png]]

- `type` — **never change this.** It's how every table and view knows what the note is (`campaign`,
  `NPC`, `location`, …).
- `tags` — free-form, optional. Use them if you like tag systems.
- `world` — link to your setting's root location. Filled by the wizard.
- `campaign` — the campaign name, again. Redundant but handy for queries.
- `status` — `Active` / anything else. The Dashboard's *Active Campaigns* cards read this.
- `role` — `player`. The only role this vault supports today.
- `system` — `5e` by default. Organisational only.
- `recurrence` / `campaign_start` / `campaign_end` — cadence and dates, used to work out the next
  session.
- `dndbeyond_url` — quick shortcut, nothing reads it.
- `urls` — like `tags`, it takes multiple entries. Same idea as `dndbeyond_url`, but for anything else.

---

## 2. Build your world — locations are a nested tree

Locations are **folder notes**: a location is `{Name}/{Name}.md`, so its children can live in
subfolders underneath it. That's what makes the world tree browsable in the file explorer.

Every location type has a **tier**, and a child must sit at a *strictly deeper* tier than its
parent. The tier also decides which subfolder it lands in:

| Tier | Type | Lands in |
|---|---|---|
| 0 | Dimension | `Dimensions/` |
| 1 | Continent | `Continents/` |
| 2 | Regions | `Regions/` |
| 3 | Country | `Countries/` |
| 4 | State · Island (`Island/`) | `States/` |
| 5 | City | `Cities/` |
| — | Forest · Water · Mountain · Dungeon | a folder named after the type — these nest anywhere |

So a city inside a country ends up at
`World/Locations/Dimension/{World}/Countries/{Country}/Cities/{City}/{City}.md`.

**The wizard asks for the parent *before* the type**, precisely so it can offer only the types that
are legal under that parent. Pick a City as parent and you'll only be offered environments — nothing
tiered nests inside a city.

Two ways in:

- **`New Location`** — asks for a name, whether it has a parent, then the type. Skip the parent and
  it goes to `World/Locations/{Type}/{Name}/{Name}.md`.
- **`Macro - Add Location (Child)`** (from the command palette, `ctrl + o`) — same thing, but it
  offers the note you're currently in as the parent. Handy while reading a country note.

The `locations` property on a location holds its **parent**, and the wizard fills it in. Once set,
the parent's index picks the child up automatically:

![[Pasted image 20250912102031.png]]

![[Pasted image 20250912102527.png]]

A new location note looks like this:

![[Pasted image 20250912100434.png|450]]

with these properties:

![[Pasted image 20250912101122.png]]

- `version` — template version. Ignore it.
- `type` — `Location`. Don't touch.
- `name` — well.
- `aliases` — other names this note answers to. If `Bob Tremblay` has the alias `Bob the Strong`…

  ![[Pasted image 20250912101444.png|450]]

  …you can write `[[Bob Tremblay|Bob the strong]]`, which renders as
  [[Bob Tremblay|Bob the strong]].
- `world` — auto-filled from the campaign's `world`.
- `date` — created date.
- `campaigns` — auto-filled link back to the campaign.
- `locations` — the **parent** location (see above).
- `location_type` / `location_tier_level` — set by the wizard; drives the icon, the folder and the
  index filters.
- `description` — the long version.
- `word_description` — a few adjectives. This is what shows up in most index tables, so it's worth
  filling.
- `urls`, `img` — links and the note's image.

  ![[Pasted image 20250912102756.png|300]]

---

## 3. Everything else

Same shape everywhere: click the button, answer the prompts, press `Esc` on anything you'd rather
leave empty. The first prompt is almost always the name:

![[Pasted image 20250912092521.png|450]]

The wizard picks the icon and colour for you from the type you choose — icons are never a free
choice.

| Button | It asks | It lands in |
|---|---|---|
| `New Session` | nothing | `Sessions/{NNN}_{YYYYMMDD}.md`, numbered and dated for you |
| `New Player` | name, class (14), player, race | `PC/` |
| `New Quest` | name, reward, owner, location | `Quests/` |
| `New NPC` | name, creature type (14 + `Unknown`), gender, where you met | `World/NPC/{CreatureType}/` |
| `New Faction` | name, faction type (5), parent faction | `World/Factions/`, or `World/Factions/sub-factions/{Parent}/` |
| `New Location` | see above | the location tree |
| `New Establishment` | name, category (8), parent location | `{parent location}/Establishments/`, or `World/Establishments/` with no parent |
| `New Lore` | name, lore type (7), related lore | `World/Lores/` |
| `New Item` | name, item type (9), gold value, owner | `Inventory/` |

Every picker (parent, owner, location, faction) is **scoped to the current campaign** and filtered to
the right note type, and every one offers a `— Skip —`.

If you're unsure what an NPC is, file them as **`Unknown`** — you can change `race` later from the
property dropdown and move the note.

### Sessions

`New Session` is the one that behaves differently: it numbers itself, dates itself, and embeds the
**previous** session's summary, log, goals and housekeeping at the top so you start each game with
last week's recap already in front of you. Write as you play under **Log**, and fill **Summary** and
**Housekeeping** after the game — that's what the next session will pull in.

---

## Quick captures — `ctrl + g`

For notes you want to jot *now* and file later. `ctrl + g` inserts a template from
`00 - Config/Notes Templates`. Only the **name** is required — leave anything else empty and the line
keeps its `{hint}`, so a half-filled capture is fine:

- `Note_Sending` — receiving or sending, who the other party is (NPC or player), then the message
  with a live word counter that warns you past 25 words
- `Note_New_NPC` — race, sub-race, gender, age, occupation, where you met them, factions, vibe…
- `Note_New_Faction` — type, parent faction, leader, HQ, goal, vibe
- `Note_New_Location` — parent location, type, ruler, terrain, vibe
- `Note_New_Establishment` — category, where it sits, owner, what it's known for, vibe

The four world captures ask everything in **one form**, and you pick rather than type wherever the
answer already exists: types come from the same tables the `New NPC` / `New Faction` / `New Location`
/ `New Establishment` buttons use, and locations, factions, leaders and owners are **dropdowns of the
notes in this campaign** (an NPC's factions are a multi-select — tick as many as you need, `Alt+Enter`
to save). So nothing has to be retyped later.

### Promoting a capture into a real note

Each capture ends with a checkbox and a button:

```
- [ ] Promote to World NPC
[ Promote to World NPC ]
```

Click it (or run `Macro - Promote NPC Capture` from `ctrl + o`) and the vault:

1. reads the capture and creates the real note — the NPC lands in `World/NPC/{CreatureType}/`, a
   location nests under its parent at the right tier, a sub-faction goes to
   `Factions/sub-factions/{Parent}/`, an establishment lands inside its location's folder;
2. fills the frontmatter from the capture — type and icon, gender, age, occupation, ruler, owner,
   terrain, parent links, and the factions you ticked, all as proper `[[links]]` when the note exists;
3. ticks the capture off in your session note as `- [x] Promote to World NPC → [[Name]]`, links the
   new note and removes the button.

Cancel anywhere and the capture is left untouched, so you can promote it later. Lines with no
frontmatter field of their own (an NPC's *Goal* and *Looks* beyond the description, *PC Connection*)
stay in the session note — the capture remains the record of that moment.

---

## Rules that will save you pain

> [!warning] Give every note a unique name
> Two notes named `Material_Plane` in two campaigns and you'll never know which link points where.
> Qualify them: `Material_Plane_Solstpeak`. Links in this vault are by name, not by path.

> [!warning] No leading or trailing spaces in a name
> They break links in ways that are annoying to find later.

> [!warning] Never edit `type`
> Every table, card and index in the vault filters on it.

---

## Quick tips

If a note renders as raw markup like this:

![[Pasted image 20250912103505.png|850]]

press `ctrl + shift + e` to switch back to live-preview mode.

Search and navigation:

- `ctrl + p` — quick switcher (jump to a note by name)
- `ctrl + o` — command palette (this is where `Macro - Open Current Campaign` lives)
- `ctrl + g` — insert a quick-capture template

![[Pasted image 20250912103735.png]]

Deleted a note by accident? It's in your computer's trash — restore it from there.

Link anything with `[[NameOfFile]]`, in the body *or* in a property. Autocomplete kicks in as you
type, and `[[Note|label]]` lets you show different text.

Location icons and what they mean: [[Cheat Cheat]].

---

## Under the hood

You don't need any of this to play, but if you want to change how the vault behaves:

| What | Where |
|---|---|
| Note templates | `00 - Config/Templates/` |
| Quick-capture notes | `00 - Config/Notes Templates/` |
| Wizards, helpers, macros | `00 - Config/_obsi/_obsi_scripts/` — see its `README.md` |
| Dataview views (tables, cards, infoboxes) | `00 - Config/_obsi/_obsi_views/` — see its `README.md` |
| Icons and type lists | `00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js` |

`IconRegistry` is the single source of truth for every type list in the vault — creature types,
faction types, location tiers, item types, classes. **Add or rename a type there, not in a wizard**,
then regenerate the matching metadata-menu dropdown. Editing it needs an Obsidian reload to take
effect.
