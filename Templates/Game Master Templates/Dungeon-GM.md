---
type: Dungeon
tags: []
name: <% tp.file.title %>
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
description: ""
locations:
  - None
locationType:
  - Ruined
  - Lost City
  - Abandon
pronounced: 
aliases: []
theme: 
terrain: []
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[PlaceholderImage.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.alias` |
> **Type** | `=this.locationType` |
> **Theme** | `=this.theme` |
> **Region** | `=link(this.Region)` |
> **Terrain** | `=this.terrain` |
> **Location** | `=link(this.location)` |

> [!info|bg-c-purple]- Description
>`=this.description`

## Map
> ```leaflet
> id: <% tp.file.title %>_dungeon_map_Leaflet_
> image: [[PlaceholderImage.png]]
> height: 600px
> width: 640px
> lat: 50
> long: 50
> minZoom: 1
> maxZoom: 5
> defaultZoom: 1
> unit: meters
> scale: 1
> darkMode: false
> ```

## Notable Characters
```button
name New NPC
type command
action QuickAdd: Template - Add NPC GM
```
###### Table
```dataview
table description as "Description", alive as "Alive", playerRelations as "Relation", faction as "Factions"
from "Worlds/Lymnevia"
WHERE contains(type,"NPC") 
and contains(locations,[[<% tp.file.title %>]])
SORT file.name ASC
```

## Factions 
```button
name New Factions
type command
action QuickAdd: Template - Add Faction GM
```
###### Table
```dataview
table description as "Description"
from "Worlds/Lymnevia"
WHERE contains(type,"faction") 
and contains(locations,[[<% tp.file.title %>]])
SORT file.name ASC
```

## History
TBD

## DM Notes
### Plot Hooks


### Hidden Details


### General Notes
