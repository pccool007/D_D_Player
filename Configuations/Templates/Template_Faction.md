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
status: Active
faction_type: Organization
locations:
description: ""
emblem_description:
goal: Define Goal
alignment:
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
###### Table
```dataview
table description as "Description", condition as "Alive", partyStanding as "Relation", locations as "Locations"
from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPCS"
WHERE contains(type,"NPC") 
and contains(factions,[[<% tp.file.title %>]])
SORT file.name ASC
```


>[!example|bg-c-orange]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```

>[!example|bg-c-orange]- Lores
>```dataview
> table description as "Description"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### History
TBD

### Notes

