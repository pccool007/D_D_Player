---
version: "1.0"
type: Location
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
locations:
location_type: City
description: ""
urls:
img: "[[placeHolderLocations.png]]"
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name`
> ```dataviewjs
> const img = dv.current().img;
> if (img) {
>    dv.paragraph(`!${img}`); 
> } else {
>    dv.paragraph("No NPC image found.");
> }
>```
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.aliases` |
> **Type** | `=this.locationType` |
> **Population** | `=this.population` |
> **Theme** | `=this.theme` |
> **Region** | `=link(this.region)` |
> **Terrain** | `=this.terrain` |
> ###### Politics
>  |
> ---|---|
> **Ruler(s)** | TBD |
> **Leaders** | TBD |
> **Govt Type** | `=this.govtType` |
> **Defenses** | `=this.defences` |
> **Religion(s)** | `=link(this.religions)` |
> ###### Commerce
>  |
> ---|---|
> **Imports** | `=this.imports` |
> **Exports** | `=this.exports` |

## Map
> [!tip] Map
> ```leaflet
> id: <% tp.file.title %>_map_Leaflet_
> image: [[placeHolderMap.jpeg]]
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

## History

> [!info|bg-c-purple]- Description
>`=this.description`

## GM Notes
### Plot Hooks

### Hidden Details

### General Notes
### Associated 
#### Notable Information 

###### Notable Establisment
```button
name New Establishment
type command
action QuickAdd: Macro - Add Establishment World
```
> [!example|bg-c-brown]- Table Shops/Services
> ```dataview
> table description as "Description", owner as "Owner"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"establishment") 
> and contains(locations,[[<% tp.file.title %>]])
> and contains(locationType, "Shops/Services")
> SORT file.name ASC
> ```

> [!example|bg-c-brown]-  Table Points of Interest
> ```dataview
> table description as "Description", owner as "Owner"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"establishment") 
> and contains(locations,[[<% tp.file.title %>]])
> and contains(locationType, "Point of Interest")
> SORT file.name ASC
> ```

#### Notable Characters
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC World
```

> [!example|bg-c-brown]-  Table NPC
> ```dataview
> table description as "Description", condition as "Alive", partyStanding as "Relation", factions as "Factions"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

#### Factions 
```button
name New Factions
type command
action QuickAdd: Macro - Add Faction World
```

>[!example|bg-c-brown]- Factions
> ```dataview
> table description as "Description"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"faction") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

#### Dungeons
```button
name New Dungeon
type command
action QuickAdd: Macro - Add Dungeon World
```

>[!example|bg-c-brown]- Dungeons 
> ```dataview
> table description as "Description"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"Dungeon") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

#### Other
>[!example|bg-c-brown]- Lores
> ```dataview
> table description as "Description"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

>[!example|bg-c-brown]- Quest's For <% tp.file.title %>
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", status as "Status"
> from "Campaigns"
> WHERE contains(type,"quest") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

>[!example|bg-c-orange]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```