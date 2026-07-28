---
type: dashboard
tags:
---
# Smoke test

Run this after touching anything in `_obsi_scripts/`, `_obsi_views/` or `Templates/`.
Nothing here is automated — the wizards live inside Obsidian's UI, so the only real
test is clicking the buttons.

> [!warning] Reload Obsidian first
> Node caches `require()`, so edits to `IconRegistry`, `LocationHierarchy`,
> `CaptureSpecs`, `FormPrompt` or `MultiSelectPrompt` do **not** reach QuickAdd until
> a reload. A "my fix did nothing" bug is nearly always this.

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

- [ ] Click the button, press `Esc` at the **first** prompt → no file appears anywhere
- [ ] Click again, answer the first prompt, press `Esc` at the **second** → still nothing

Check the folder, not just the open tab — a junk note lands in the target folder
without opening.

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

## 3. Infobox rows render values, not blanks

- [ ] Open the faction from step 2 and fill `emblem_description`, `faction_type`,
      `faction_status`, `leader`
- [ ] All four show up in the infobox (they read snake_case keys — a camelCase ref
      silently renders empty)
- [ ] Same check on an NPC's **First Meeting Location**, and a Lore note's **Location**

## 4. Folders are the plural tier names, with or without a parent

- [ ] The throwaway campaign's world landed in
      `World/Locations/Dimensions/{World}/{World}.md` — **plural**
- [ ] Add a City **with no parent** → `World/Locations/Cities/{Name}/{Name}.md`
- [ ] Add a City **under a Country** → `…/{Country}/Cities/{Name}/{Name}.md`
- [ ] Add a Forest (an untiered environment) → lands in `Forest/`, not a tier folder
- [ ] Add an Island → lands in `Island/`, keeping its own folder override
- [ ] Pick a City as a parent → only environments are offered, no tiered types

## 5. Session numbering and the recap

- [ ] `New Session` in a campaign with **no** sessions → the Recap section says
      "First session in this campaign", with **no** embeds
- [ ] `New Session` again → Recap embeds resolve to session 1, not to a broken
      `![[No games found#^summary]]`
- [ ] Filenames increment: `001_…` then `002_…`, and `session_num` matches

## 6. Capture → promote round trip

- [ ] In a session note, `ctrl+G` an NPC capture and fill the name
- [ ] Run `Macro - Promote NPC Capture`:
  - [ ] Note created at `World/NPC/{CreatureType}/{Name}.md`
  - [ ] The capture's checkbox is ticked and `→ [[Name]]` is appended
  - [ ] The `button` fence is gone
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
```

All three should print nothing. Then, that every script still parses:

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
