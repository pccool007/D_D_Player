---
type: faction
tags: []
status: Active
factionType:
  - Religion
  - Citizenship
  - Gang
  - Organization
  - Deity_Group
locations:
  - None
description: ""
emblemDescription: 
goal: ""
alignment: 
name: <% tp.file.title %>
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
---

# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name` (`=this.subType`)
> **Pronounced:**  "`=this.pronounced`"
> ![[placeHolderNPC.jpg|cover hm-sm]]
> ###### Bio
>  |
> ---|---|
> **Emblem Description** | `=this.emblemDescription`
> **Faction Type** | `=this.factionType`  |
> **Status** | `=this.status` |
> **Current Location** | `=link(this.locations)` |
> **Alignment** | `=this.alignment` |

> [!info|bg-c-purple]- Description
> `=this.description`

>> [!goal|text-Center bg-c-gray] Goal
>> `=this.goal`

## Members List
```button
name New NPC
type command
action QuickAdd: Template - Add NPC GM
```
###### Table
```dataview
table description as "Description", condition as "Alive", partyStanding as "Relation", locations as "Locations"
from "Worlds/Lymnevia"
WHERE contains(type,"NPC") 
and contains(factions,[[<% tp.file.title %>]])
SORT file.name ASC
```

### History
TBD

### DM Notes
#### Plot Hooks

#### Hidden Details

#### General Notes

#### Logs

