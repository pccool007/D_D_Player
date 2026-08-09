---
version: "2.0"
type: location
icon: LiTriangle
iconColor: blue
name: Forterra
aliases:
  - Human Kingdom
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
locations:
  - "[[Forterian Isle]]"
location_type: Country
location_tier_level: 3
description: The great human kingdom of the south-eastern isles, ruled by the Radiant Monarch. Its island chains carry much of the Archipelago's trade and most of its appetite for exploration.
word_description:
  - Human Kingdom
  - Trade & Exploration
population:
leader: "[[Roland Thatchborne]]"
theme:
terrain:
govtType:
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
> id: Forterra_map_Leaflet_
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
> [!table-data]- States
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "State" });
> ```

> [!table-data]- Cities
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "City" });
> ```

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
> [!table-data]- Quest's For Forterra
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/Tides_of_Fates/Quests"
> WHERE lower(type) = "quest"
> and contains(locations,[[Forterra]])
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