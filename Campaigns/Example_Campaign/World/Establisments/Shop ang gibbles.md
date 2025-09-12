---
version: "1.0"
type: Establishment
name: Shop ang gibbles
aliases:
world: "[[Campaigns/Example_Campaign/World/Locations/Example_Material_Plane.md|Example_Material_Plane]]"
date: 2025-09-12
campaigns: "[[Example_Campaign]]"
tags:
icon: LiStore
establishment_type: Commerce & Trade
locations:
description: ""
word_description:
owner:
pronounced:
---
# [[Shop ang gibbles]]

> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[placeHolderEstablishment.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.alias` |
> **Location** | `=link(this.location)` |
> **Type** | `=this.locationType` |
> ###### Politics
>  |
> ---|---|
> **Owner(s)** | `=link(this.owner)` |

> [!info|bg-c-purple]- Description
>`=this.description`

## Associated NPC's
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC
```
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/Example_Campaign/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[Shop ang gibbles]])
> SORT file.name ASC
> ```

## Inventory/Services

## Other Information

## Logs

