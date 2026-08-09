---
version: "2.0"
type: location
icon: LiBuilding
iconColor: blue
name: Amberhall
aliases:
world: "Soltpeak"
date: 2026-07-28
campaigns: "[[Tides_of_Fates]]"
tags:
locations:
  - "[[Veilmoria]]"
location_type: City
location_tier_level: 5
description: The coastal capital of Veilmoria and the seat of Queen Thalena Vaer. The civil war ended here and the city still wears it — half-rebuilt districts, old grievances kept close, and a peace that everyone treats as breakable. Locals will tell you the catacombs beneath the lower city are haunted, and will not be argued out of it.
word_description:
  - Coastal
  - Post-War
  - Tense
population:
leader: "[[Thalena Vaer]]"
theme: Post-war capital, fragile peace, buried history
terrain: Coastal city, highland kingdom, catacombs beneath the lower districts
govtType: Seat of the Veilmorian crown
defences:
imports:
exports:
urls:
img: "[[placeHolderLocations.png]]"
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!map] Map
> ```leaflet
> id: Amberhall_map_Leaflet_
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
> [!table-data]- Other
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", excludeTypes: ["Dimension", "Continent", "Region", "Country", "State", "City", "Dungeon"] });
> ```

> [!table-data]- Dungeons
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "Dungeon" });
> ```

### Associated Establishment 
> [!table-data]- Table Shops/Services
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/establishment_table", { link: "locations" });
> ```

### Associated Characters
> [!table-data] List of NPC's
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/npc_table", { link: "locations" });
> ```


### Associated Factions 
> [!table-data]- Factions
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/faction_table", { link: "locations" });
> ```

### Associated Quest
> [!table-data]- Quest's For Amberhall
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/Tides_of_Fates/Quests"
> WHERE lower(type) = "quest" 
> and contains(locations,[[Amberhall]])
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
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/lore_table", { link: "relations" });
> ```

## History

## Logs