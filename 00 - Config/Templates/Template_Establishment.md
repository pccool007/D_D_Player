---
version: "1.1"
type: Establishment
icon: {{VALUE:icon}}
iconColor: orange
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
establishment_type: {{VALUE:establishment_type}}
img: "[[placeHolderEstablishment.png]]"
locations:{{VALUE:locations}}
description: "{{VALUE:description}}"
word_description: {{VALUE:word_description}}
owner: {{VALUE:owner}}
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name`
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "img", label: "Establishment" });
> ```
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.aliases` |
> **Location** | `=link(this.locations)` |
> **Type** | `=this.establishment_type` |
> ###### Politics
>  |
> ---|---|
> **Owner(s)** | `=link(this.owner)` |
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/action_bar", {
>   actions: [
>     ["New NPC", "Macro - Add NPC", "#8a5a2b"],
>   ],
>   compact: true,
> });
> ```

> [!info|bg-c-purple]- Description
>`=this.description`

## Associated NPC's
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

## Inventory/Services

## Other Information

## Logs

