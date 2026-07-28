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
parent_faction:{{VALUE:parent_faction}}
locations:{{VALUE:locations}}
description: "{{VALUE:description}}"
word_description: {{VALUE:word_description}}
emblem_description: {{VALUE:emblem_description}}
goal: {{VALUE:goal}}
alignment:
---

# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name` 
> **Aliases:**  "`=this.aliases`"
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "img", label: "Faction" });
> ```
> ###### Bio
>  |
> ---|---|
> **Leader** | `=this.leader`
> **Emblem Description** | `=this.emblemDescription`
> **Faction Type** | `=this.factionType`  |
> **Status** | `=this.status` |
> **Current Location** | `=link(this.locations)` |
> **Alignment** | `=this.alignment` |
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/action_bar", {
>   actions: [
>     ["New NPC", "Macro - Add NPC", "#8a5a2b"],
>   ],
>   compact: true,
> });
> ```

> [!info|bg-c-purple] Description
> `=this.description`

> [!goal] Goal
> `=this.goal`

## Members List
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(factions,[[<% tp.file.title %>]])
> SORT file.name ASC
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
>```dataview
> table description as "Description", lore_type as "Type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### History


### Logs

