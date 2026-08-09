---
version: "1.0"
type: faction
icon: LiBriefcase
iconColor: purple
name: Keelward
aliases:
  - The Federal Navy
  - The Navy
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
img: "[[placeHolderFactions.png]]"
leader: "[[Elion Vark]]"
faction_status: Active
faction_type: Organisation
parent_faction: "[[Soltpeak Federation]]"
locations:
  - "[[Soltpeak]]"
description: "The naval arm of the Soltpeak Federation. The Keelward enforces Federation law on open water, patrols trade routes, responds to piracy, and projects Federal authority across the Archipelago. It predates the Federation itself, formed from the fleets of the founding maritime states, and its sailors' loyalty is famously personal — owed to the High Admiral, and through him to the flag."
word_description:
  - Federal Navy
  - Law at Sea
emblem_description: ""
goal: "Enforce Federation law on open water, protect maritime trade, and project Federal authority across the Archipelago."
alignment: Lawful Neutral
---

> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!info|bg-c-purple] Description
> `=this.description`

> [!goal] Goal
> `=this.goal`

## Members List
> [!table-data] List of NPC's
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/npc_table", { link: "factions" });
> ```

## Index
---
>[!table-data]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```

--- 
>[!table-data]- Lores
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/lore_table", { link: "relations" });
> ```

### History


### Logs

