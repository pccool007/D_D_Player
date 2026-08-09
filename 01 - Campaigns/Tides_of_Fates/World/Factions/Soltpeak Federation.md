---
version: "1.0"
type: faction
icon: LiBriefcase
iconColor: purple
name: The Soltpeak Federation
aliases:
  - Federation
  - The Federation
world: Soltpeak
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
img: "[[00 - Config/_obsi/assets/Tides_of_Fates/Soltpeak Federation.png]]"
leader: "[[Elion Vark]]"
faction_status: Active
faction_type: Organisation
parent_faction:
locations:
  - "[[Soltpeak]]"
description: A maritime union spanning the entire Archipelago, the Soltpeak Federation is the largest governing body in the known world. Born from the Accord of Still Waters, it presents itself as a voluntary compact of island-states bound by shared law, shared trade, and shared protection against the chaos of the open sea. Its navy enforces its borders, its courts deliver its justice, and its mints mint its coin.
word_description:
  - Maritime Union
  - Federal Power
emblem_description: A navy blue circular seal depicting a tall ship at full sail upon open seas, flanked by laurel wreaths. The motto 'Ensuring Harmony, Fostering Unity' rings the outer edge.
goal: To maintain peace across the Archipelago, protect free maritime trade, and ensure no island stands alone against the tide.
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

