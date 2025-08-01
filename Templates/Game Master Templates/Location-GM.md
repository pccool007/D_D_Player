---
type: Location
tags: 
name: <% tp.file.title %>
pronounced: 
aliases:
  - None
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
locations:
  - None
location_type:
  - City
  - Dungeon
  - Country
  - Continent
region: 
description: ""
population: 
theme: 
terrain: 
govtType:
  - None
defences:
  - None
religions:
  - None
imports:
  - None
exports:
  - None
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[PlaceholderImage.png|cover hm-sm]]
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


> [!info|bg-c-purple]- Description
>`=this.description`

## Map
> ```leaflet
> id: <% tp.file.title %>_map_Leaflet_
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

## Notable Information 

> [!info|bg-c-purple]- Districts
TBD

##### Notable Establisment
```button
name New Establishment
type command
action QuickAdd: Macro - Add Establishment GM
```
###### Table Shops/Services
```dataview
table description as "Description", owner as "Owner"
from "Worlds/Lymnevia"
WHERE contains(type,"establishment") 
and contains(locations,[[<% tp.file.title %>]])
and contains(locationType, "Shops/Services")
SORT file.name ASC
```
###### Table Points of Interest
```dataview
table description as "Description", owner as "Owner"
from "Worlds/Lymnevia"
WHERE contains(type,"establishment") 
and contains(locations,[[<% tp.file.title %>]])
and contains(locationType, "Point of Interest")
SORT file.name ASC
```

## Notable Characters
```button
name New NPC
type command
action QuickAdd: Template - Add NPC GM
```
###### Table
```dataview
table description as "Description", condition as "Alive", partyStanding as "Relation", factions as "Factions"
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

## Locations
```button
name New Location
type command
action QuickAdd: Template - Add Location GM
```
```button
name New Dungeon
type command
action QuickAdd: Template - Add Dungeon GM
```
###### Table City
```dataview
table description as "Description"
from "Worlds/Lymnevia"
WHERE contains(type,"Location") 
and contains(locations,[[<% tp.file.title %>]])
and contains(locationType, "City")
SORT file.name ASC
```
###### Table Dungeon
```dataview
table description as "Description"
from "Worlds/Lymnevia"
WHERE contains(type,"Dungeon") 
and contains(locations,[[<% tp.file.title %>]])
SORT file.name ASC
```
###### Table Country
```dataview
table description as "Description"
from "Worlds/Lymnevia"
WHERE contains(type,"Location") 
and contains(locations,[[<% tp.file.title %>]])
and contains(locationType, "Country")
SORT file.name ASC
```
## Quest's For The Mistsmash
```dataview
table description as "Description", owner as "Owner of the Quest", reward as "Reward", status as "Status"
from "Campaigns/The Mistsmash/quests"
WHERE contains(type,"quest") 
and contains(locations,[[<% tp.file.title %>]])
SORT file.name ASC
```

## History


## DM Notes
### Plot Hooks


### Hidden Details


### General Notes
