---
version: "1.0"
type: Faction
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
img: "[[placeHolderFactions.png]]"
leader: {{VALUE:leader}}
faction_status: Active
faction_type: {{VALUE:faction_type}}
parent_faction: {{VALUE:parent_faction}}
locations: {{VALUE:locations}}
description: "{{VALUE:description}}"
word_description: "{{VALUE:word_description}}"
emblem_description: "{{VALUE:emblem_description}}"
goal: "{{VALUE:goal}}"
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

