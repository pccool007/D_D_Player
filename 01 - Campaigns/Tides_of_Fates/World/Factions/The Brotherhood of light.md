---
version: "1.0"
type: faction
icon: LiBriefcase
iconColor: purple
name: The Brotherhood of light
aliases:
  - The Brotherhood
  - Monarch's Angels
  - The Chapters of Forterra
world: Soltpeak
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
img: "[[00 - Config/_obsi/assets/Tides_of_Fates/The Brotherhood of light.png]]"
leader: "[[Roland Thatchborne]]"
faction_status: Active
faction_type: Organisation
parent_faction:
locations:
  - "[[Soltpeak]]"
  - "[[Forterra]]"
description: "The knightly order of Forterra — those who believe in the Radiant Monarch and hold themselves to upholding good across the kingdom and beyond it. The Brotherhood is not one body in one place: it is organised into chapters, each with its own charge and its own reputation, all of them answering to the flame on the throne."
word_description:
  - Knightly Order
  - Monarch's Angels
emblem_description: A black and white symmetrical design featuring a sword at the centre with a compass-like backdrop, adorned with ornamental elements.
goal: Uphold the Kingdom of Forterra, uphold the peace, and protect the Forterrans.
alignment: Lawful Good
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

