---
version: "1.0"
type: Faction
icon: LiChurch
iconColor: purple
name: test1
aliases:
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
img: "[[placeHolderFactions.png]]"
leader: "[[Bob]]"
faction_status: Active
faction_type: Religion
parent_faction: 
locations: 
  - "[[Forterian Isle]]"
description: ""
word_description: ""
emblem_description: ""
goal: ""
alignment:
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

