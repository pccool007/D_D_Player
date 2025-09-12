---
version: "1.0"
type: Establishment
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: "<% tp.user.getFileRacineForProperties(tp) %>"
tags:
establishment_type: Commerce & Trade
locations:
description: ""
word_description:
owner:
pronounced:
---
# [[<% tp.file.title %>]]

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
> table word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

## Inventory/Services

## Other Information

## Logs

