---
type: dashboard
tags:
---
# Smoke test

Run this after touching anything in `_obsi_scripts/`, `_obsi_views/` or `Templates/`.
Nothing here is automated — the wizards live inside Obsidian's UI, so the only real
test is clicking the buttons.

> [!warning] Reload Obsidian first
> Node caches `require()`, so edits to anything in `Helpers/` — `IconRegistry`,
> `LocationHierarchy`, `CaptureSpecs`, `FormPrompt`, `MultiSelectPrompt`,
> `WizardForm`, `LocationForm` — do **not** reach QuickAdd until a reload. A "my fix
> did nothing" bug is nearly always this.

> [!tip] Use a throwaway campaign
> Run `New Campaign` as `Smoke_Test` and do everything below inside it, then delete
> the whole `01 - Campaigns/Smoke_Test/` folder. Nothing here should touch a real one.

---

## 0. Esc creates nothing

The failure this catches: QuickAdd only aborts a macro on a **throw**. A wizard that
merely sets `variables.cancelled` lets the template step run on and write a note out
of empty values.

For each of `New NPC`, `New Location`, `New Faction`, `New Quest`, `New Player`,
`New Lore`, `New Item`, `New Establishment`, `New Campaign`:

- [ ] Click the button, press `Esc` on the form → no file appears anywhere
- [ ] Click again, fill the name, press `Esc` → still nothing
- [ ] Click again, leave the name empty and press `Enter` → the form **stays open**
      with the name row flagged red, and nothing is created

Check the folder, not just the open tab — a junk note lands in the target folder
without opening.

## 0b. One form, not a chain

Every `New …` button opens a **single** modal with all its questions on it. If you
get a one-question-at-a-time suggester, the wizard is on the old path.

- [ ] `New NPC` → one modal: name, creature type, gender, where met, factions
- [ ] The creature type starts on `Unknown` and the class on `Other`, so pressing
      `Enter` straight away still produces a valid note
- [ ] `New Establishment` **from a location note** → the parent location row is
      already filled in with that note
- [ ] `New Location` from a location note → same, the parent is pre-selected

## 0c. Empty pickers are visible, not missing

In a campaign with no factions yet:

- [ ] `New NPC` → the **Factions** row is present but greyed, its button reading
      `None available`
- [ ] Create the NPC anyway → its `factions` property is empty, not `[[]]`
- [ ] Create a faction, then `New NPC` again → the button is live

## 0d. The multi-select button and its picker

The failure this catches: two modals stacked, both listening for keys on `document`.
Without the form suspending itself, `Esc` in the picker also cancels the wizard and
`Enter` saves it behind your back.

- [ ] `New Faction` → the **Locations** row is a button reading `Choose locations…`
- [ ] Click it → a searchable list opens **on top of** the form; each row shows the
      note's name and its path
- [ ] Tick one, `Save` → back on the form, everything you had typed still there, and
      the button now reads that location's **name**
- [ ] Click it again, tick a second, `Save` → the button reads `2 selected`
- [ ] Click it again and press `Esc` → only the list closes. The form is still open,
      still filled in, and the button still reads `2 selected`
- [ ] Click it, untick everything, `Save` → back to `Choose locations…`
- [ ] The campaign's **world** is not one of the rows — it is added on save whatever
      the button says, so it gets no tickable row (`FactionWizard` and `QuestWizard`
      pass it as `notesOf`'s `exclude`)
- [ ] Create the faction → `locations` holds what the button last said, **plus the
      campaign world at the front** — so with everything unticked, the world alone

## 1. A colon in free text does not corrupt the note

- [ ] `New NPC` → name `Colon Test`, and for a free-text field type
      `sharp-tongued: hides a limp`
- [ ] Open the note: Obsidian shows **no** YAML error banner, and Properties lists
      `word_description` with the full text including the colon

Repeat for at least one of `goal` (faction), `terrain` (location), `reward` (quest).

## 2. The index tables actually resolve

The failure this catches: `contains()` is case-sensitive, so `contains(type,"faction")`
never matched `type: Faction`. The tables rendered **empty with no error**.

- [ ] Create a Location `Table Test City`
- [ ] Create a Faction with `locations: [[Table Test City]]`
- [ ] Create a Quest with `locations: [[Table Test City]]`, and set its `quest_status`
- [ ] Open `Table Test City`:
  - [ ] **Associated Factions** lists the faction
  - [ ] **Associated Quest** lists the quest **and its Status column is filled**
  - [ ] **Associated Characters** lists an NPC once you add one there

## 2b. Every new note lands in the campaign world

The failure this catches: an NPC created with no meeting place had an empty
`locations` and appeared on no location page at all. `WizardForm.withWorld` now leads
every `locations` list with the campaign's world.

- [ ] `New NPC`, leave **Where were they met?** on `— Skip —` → the note's `locations`
      holds the world **alone**, and `first_location` / `last_seen` are **empty** (the
      world is where they live, not where they were met)
- [ ] `New NPC` again, pick a city → `locations` is the world **then** the city;
      `first_location` and `last_seen` are the city alone
- [ ] `New NPC` a third time and pick the **world itself** as where they were met →
      `locations` holds it **once**, not twice
- [ ] `New Quest` and `New Establishment` → both carry the world in `locations`; the
      establishment still files under `{its parent}/Establishments/`
- [ ] `New Lore` → `locations` holds the world, even though the form never asks
- [ ] Open the world note → its **Associated Characters** / **Factions** / **Quest**
      tables now list everything in the campaign
- [ ] **The exemption:** `Add Location (Child)` under a Country → the child's
      `locations` is that Country **only**. A location's `locations` is its hierarchy
      parent and decides its folder — the world must never be injected there

## 3. Infobox rows render values, not blanks

- [ ] Open the faction from step 2 and fill `emblem_description`, `faction_type`,
      `faction_status`, `leader`
- [ ] All four show up in the infobox (they read snake_case keys — a camelCase ref
      silently renders empty)
- [ ] Same check on an NPC's **First Meeting Location**, and a Lore note's **Location**
- [ ] `New Item` → the note has an infobox with Type / Owner / Value rows and an
      item image placeholder (it had no body at all before)

## 3b. A stray selection no longer hijacks the name

- [ ] Select a few words in a note, then click `New NPC` **without deselecting**
- [ ] The name field is **empty** — it does not arrive pre-filled with the selection,
      and the note is not named after it

## 3c. A button outside a campaign refuses

The failure this catches: the folder resolver takes path segment `[1]` of the active
note without checking it, so from a note outside `01 - Campaigns/` it produces the
*truthy* string `01 - Campaigns/undefined` and the note is filed there.

- [ ] Open `README.md` (or the `Dashboard`), run `Macro - Add NPC` from `ctrl+o`
- [ ] A notice says the campaign folder cannot be resolved, **no form opens**, and no
      `01 - Campaigns/undefined/` folder appears

## 4. Folders are the plural tier names, with or without a parent

- [ ] The throwaway campaign's world landed in
      `World/Locations/Dimensions/{World}/{World}.md` — **plural**
- [ ] Add a City **with no parent** → `World/Locations/Cities/{Name}/{Name}.md`
- [ ] Add a City **under a Country** → `…/{Country}/Cities/{Name}/{Name}.md`
- [ ] Add a Forest (an untiered environment) → lands in `Forest/`, not a tier folder
- [ ] Add an Island → lands in `Island/`, keeping its own folder override

### 4b. The type list follows the parent, live

- [ ] `New Location`, parent on `— Skip —` → every type is offered
- [ ] Switch the parent to a **Country** → only State, City, Island and the
      environments remain; whatever you had picked survives if it is still legal
- [ ] Pick `Dimension`, then switch the parent to a **Country** → the selection can't
      survive, so it falls back to the first legal type rather than staying illegal
- [ ] Switch it to a **City** → only the four environments (Forest, Water, Mountain,
      Dungeon) remain — they are untiered and may nest anywhere
- [ ] Switch back to `— Skip —` → the full list returns

## 5. Session numbering and the recap

- [ ] `New Session` in a campaign with **no** sessions → the Recap section says
      "First session in this campaign", with **no** embeds
- [ ] `New Session` again → Recap embeds resolve to session 1, not to a broken
      `![[No games found#^summary]]`
- [ ] Filenames increment: `001_…` then `002_…`, and `session_num` matches

## 6. Capture → promote round trip

- [ ] In a session note, `ctrl+G` an NPC capture and fill the name — it is **one**
      form; the only thing that opens on top is the Factions picker, and only when
      you click its button
- [ ] `ctrl+G` a Faction capture, pick two locations → the block reads
      `**Locations:** A, B` (this field was the single-value `HQ` before; a capture
      still carrying an `**HQ:**` line must promote too, via the label alias)
- [ ] The capture's **Promote** button renders (it is an `action_bar` dataviewjs
      block now, not a Buttons-plugin fence — the `buttons` plugin is disabled, so
      a bare `button` fence would show as raw text)
- [ ] Promote the faction capture → its `locations` property holds **both** links,
      plus the campaign world at the front (three in all)
- [ ] Run `Macro - Promote NPC Capture`:
  - [ ] Note created at `World/NPC/{CreatureType}/{Name}.md`
  - [ ] The capture's checkbox is ticked and `→ [[Name]]` is appended
  - [ ] The promote button block is gone, and no stray ``` fence is left behind
- [ ] Run the promote macro again on the same note → a notice says there is nothing
      pending, and **no** empty note is created
- [ ] Repeat for a Faction, Location and Establishment capture

## 7. Nothing regressed on the dashboard

- [ ] `Dashboard.md` opens on startup and its count tiles are non-zero
- [ ] The campaign card shows the throwaway campaign with its date range
- [ ] `ctrl+o` (`Macro - Open Current Campaign`) opens and pins the campaign

## 8. Clean up

- [ ] Delete `01 - Campaigns/Smoke_Test/`
- [ ] `git status` shows no leftover junk notes

---

## Checks that do not need Obsidian

Run from the vault root. These catch the whole class of bug this checklist exists for:

```bash
# type filters must all be the case-insensitive form
# (scoped to notes — the READMEs quote the broken form on purpose, to explain it)
grep -rn 'contains(type' "00 - Config/Templates" "01 - Campaigns"

# every free-text {{VALUE}} slot must be quoted
grep -rn '^\(word_description\|goal\|terrain\|occupation\|reward\|age\|subRace\): {{VALUE' "00 - Config/Templates"

# no wizard may cancel by returning
grep -rn 'cancelled = true; return' "00 - Config/_obsi/_obsi_scripts"

# no wizard may ask one question at a time any more — the forms replaced them
grep -rn 'inputPrompt\|yesNoPrompt\|quickAddApi.suggester' \
  "00 - Config/_obsi/_obsi_scripts/Wizards"

# only FormPrompt may open the multi-select picker: anything else reaching for it
# is asking a field outside the form (--include=*.js, since the README names it in prose)
grep -rln --include=*.js 'MultiSelectPrompt\|checkboxPrompt' "00 - Config/_obsi/_obsi_scripts" \
  | grep -v '_obsi_script_\(MultiSelectPrompt\|FormPrompt\)\.js$'
```

All five should print nothing. Then, that nothing writes `locations` without leading it
with the campaign world — the three that legitimately do are the ones writing a
**location's** own parent, which decides its folder:

```bash
grep -rn 'variables\.locations =' "00 - Config/_obsi/_obsi_scripts" | grep -v withWorld
```

Exactly three lines, no more: `LocationForm` (a child's parent), `CampaignWizard` (the
world note itself, which has none), and `ParseCapture`'s `location` branch. A **fourth**
means an NPC/Faction/Quest/Establishment/Lore writer lost its world — keep these calls
on one line or this check cannot see them.

Then, that every script still parses:

```bash
# -print0/read -d '' because the vault's paths contain spaces
find "00 - Config/_obsi/_obsi_scripts" -name '*.js' -print0 \
  | while IFS= read -r -d '' f; do node --check "$f" || echo "SYNTAX  $f"; done
```

And that every `=this.*` reference matches a real frontmatter key — the check that
caught `emblemDescription` against `emblem_description`:

```bash
for f in "00 - Config/Templates"/*.md; do
  keys=$(awk '/^---$/{c++; next} c==1' "$f" | grep -o '^[a-zA-Z_][a-zA-Z_0-9]*:' | tr -d ':' | sort -u)
  for r in $(grep -o 'this\.[a-zA-Z_][a-zA-Z_0-9]*' "$f" | sed 's/this\.//' | sort -u); do
    [ "$r" = "file" ] && continue
    echo "$keys" | grep -qx "$r" || echo "BROKEN REF  $(basename "$f"): this.$r"
  done
done
```
