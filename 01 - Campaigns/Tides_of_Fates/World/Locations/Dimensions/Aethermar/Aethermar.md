---
version: "2.0"
type: location
icon: LiCircle
iconColor: blue
name: Aethermar
aliases:
  - Celestial Plane
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
locations:
location_type: Dimension
location_tier_level: 0
description: The Celestial Realm, where ascended souls are transfigured into celestials.
word_description:
  - Celestial Realm
  - Ascension
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
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!map] Map
> ```leaflet
> id: Aethermar_map_Leaflet_
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
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "Continent" });
> ```

> [!table-data]- Regions
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "Region" });
> ```

> [!table-data]- Countries
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "Country" });
> ```

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
> [!table-data]- Quest's For Aethermar
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/Tides_of_Fates/Quests"
> WHERE lower(type) = "quest"
> and contains(locations,[[Aethermar]])
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