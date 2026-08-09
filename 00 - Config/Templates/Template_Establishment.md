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
locations: {{VALUE:locations}}
description: "{{VALUE:description}}"
word_description: "{{VALUE:word_description}}"
owner: {{VALUE:owner}}
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!info|bg-c-purple]- Description
>`=this.description`

## Associated NPC's
> [!table-data] List of NPC's
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/npc_table", { link: "locations" });
> ```

## Inventory/Services

## Other Information

## Logs

