---
version: "1.0"
type: Faction
name: Tremblay
aliases:
world: "[[[[Campaigns/Example_Campaign/World/Locations/Example_Material_Plane.md|Example_Material_Plane]]]]"
date: 2025-09-12
campaigns: "[[Example_Campaign]]"
tags:
img: "[[placeHolderFactions.png]]"
leader: "[[Bob Tremblay]]"
faction_status: Active
faction_type: Organization
locations:
  - "[[Country of Canada]]"
description: ""
word_description:
emblem_description:
goal: Define Goal
alignment:
---

# [[Tremblay]]
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
> table word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/Example_Campaign/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(factions,[[Tremblay]])
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
> from "Campaigns/Example_Campaign/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[Tremblay]])
> SORT file.name ASC
> ```

### History


### Logs

