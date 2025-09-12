---
version: "1.0"
type: Faction
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
img: "[[placeHolderFactions.png]]"
leader:
faction_status: Active
faction_type: Organization
locations:
description: ""
word_description:
emblem_description:
goal: Define Goal
alignment:
icon: LiUser2
iconColor: purple
---

# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name` 
> **Aliases:**  "`=this.aliases`"
> ```dataviewjs
> const img = dv.current().img;
> if (img) {
>    dv.paragraph(`!${img}`); 
> } else {
>    dv.paragraph("No NPC image found.");
> }
>```
> ###### Bio
>  |
> ---|---|
> **Leader** | `=this.leader`
> **Emblem Description** | `=this.emblemDescription`
> **Faction Type** | `=this.factionType`  |
> **Status** | `=this.status` |
> **Current Location** | `=link(this.locations)` |
> **Alignment** | `=this.alignment` |

> [!info|bg-c-purple] Description
> `=this.description`

> [!goal] Goal
> `=this.goal`

## Members List
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC
```
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
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
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### History


### Logs

