---
version: "1.1"
tags: 
type: faction
name: <% tp.file.title %>
aliases: 
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaign: 
leader: 
status:
  - Active
faction_type: Organization
locations:
  - None
description: ""
emblem_description: 
goal: ""
alignment:
---

# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name` 
> **Aliases:**  "`=this.aliases`"
> ![[placeHolderFactions.png|cover hm-sm]]
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

> [!goal|text-Center bg-c-gray] Goal
> `=this.goal`

## Members List
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC World
```
###### Table
```dataview
table description as "Description", condition as "Alive", partyStanding as "Relation", locations as "Locations"
from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
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
> WHERE contains(type,"lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### History
TBD

### DM Notes
#### Plot Hooks

#### Hidden Details

#### General Notes

#### Logs
### Player Notes

