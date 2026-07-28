---
version: "2.0"
type: Location
icon: LiCircle
iconColor: blue
name: Soltpeak
aliases:
world: "Soltpeak"
date: 2026-07-28
campaigns: "[[Tides_of_Fates]]"
tags:
locations:
location_type: Dimension
location_tier_level: 0
description: 
word_description: 
population:
leader: 
theme:
terrain: 
govtType:
defences:
imports:
exports:
urls:
img: "[[placeHolderLocations.png]]"
---
# [[Soltpeak]]
> [!infobox]
> # `=this.file.name`
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "img", label: "Location" });
> ```
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.aliases` |
> **Type** | `=this.location_type` |
> **Parent** | `=link(this.locations)` |
> **Population** | `=this.population` |
> **Theme** | `=this.theme` |
> **Terrain** | `=this.terrain` |
> ###### Politics
>  |
> ---|---|
> **Leaders** | `=this.leader` |
> **Govt Type** | `=this.govtType` |
> **Defenses** | `=this.defences` |
> ###### Commerce
>  |
> ---|---|
> **Imports** | `=this.imports` |
> **Exports** | `=this.exports` |
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/action_bar", {
>   actions: [
>     ["New Location",      "Macro - Add Location (Child)", "#2f6d4f"],
>     ["New Establishment", "Macro - Add Establishment",    "#9c4a2e"],
>     ["New NPC",           "Macro - Add NPC",              "#8a5a2b"],
>     ["New Faction",       "Macro - Add Faction",          "#6a3d9a"],
>     ["New Quest",         "Macro - Add Quest",            "#2c6e49"],
>   ],
>   compact: true,
> });
> ```

> [!map] Map
> ```leaflet
> id: Soltpeak_map_Leaflet_
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

> [!info|bg-c-purple] Description
>`=this.description`
## Index
### Associated Locations
> [!table-data]- Continents
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type, "Continent")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

> [!table-data]- Regions
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type, "Regions")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

> [!table-data]- Countries
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type, "Country")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

> [!table-data]- States
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type, "State")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

> [!table-data]- Cities
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type, "City")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

> [!table-data]- Other
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and !contains(location_type,"Dimension")
> and !contains(location_type,"Continent")
> and !contains(location_type,"Regions")
> and !contains(location_type,"Country")
> and !contains(location_type,"State")
> and !contains(location_type,"City")
> and !contains(location_type,"Dungeon")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC, location_type ASC
> ```

> [!table-data]- Dungeons
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "location" 
> and contains(location_type,"Dungeon")
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

### Associated Establishment 
> [!table-data]- Table Shops/Services
> ```dataview
> table description as "Description", owner as "Owner", establishment_type as "type"
> from "01 - Campaigns/Tides_of_Fates/World"
> WHERE lower(type) = "establishment" 
> and contains(locations,[[Soltpeak]])
> SORT file.establishment_type ASC
> ```

### Associated Characters
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "01 - Campaigns/Tides_of_Fates/World/NPC"
> WHERE lower(type) = "npc" 
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```


### Associated Factions 
> [!table-data]- Factions
> ```dataview
> table description as "Description"
> from "01 - Campaigns/Tides_of_Fates/World/Factions"
> WHERE lower(type) = "faction" 
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

### Associated Quest
> [!table-data]- Quest's For Soltpeak
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/Tides_of_Fates/Quests"
> WHERE lower(type) = "quest" 
> and contains(locations,[[Soltpeak]])
> SORT file.name ASC
> ```

### Others
>[!table-data]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```

--- 
>[!table-data]- Lores
>```dataview
> table description as "Description", lore_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World/Lores"
> WHERE lower(type) = "lore" 
> and contains(relations,[[Soltpeak]])
> SORT file.name ASC
> ```

## History

## Logs