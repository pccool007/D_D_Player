---
version: "2.0"
type: location
icon: LiTriangle
iconColor: blue
name: Veilmoria
aliases:
  - Kingdom of Veilmoria
world: "Soltpeak"
date: 2026-07-28
campaigns: "[[Tides_of_Fates]]"
tags:
locations:
  - "[[Forterian Isle]]"
location_type: Country
location_tier_level: 3
description: A resilient highland kingdom marked by misty forests, shattered keeps, and silver-threaded rivers that once bore the weight of the Federation. Born from rebellion, drowned in civil war, and now cautiously rising under a new monarchy, the nation walks a tightrope between fragile peace and buried unrest. With veins of rare ore beneath its mountains and whispers of ghosts in its capital's catacombs, Veilmoria is a land where history clings like fog and truth is often found between the cracks of official records. Queen Thalena Vaer now leads it toward reunification with the Soltpeak Federation.
word_description:
  - Highland Kingdom
  - Fragile Peace
population: "20000"
leader: "[[Thalena Vaer]]"
theme:
terrain: 
govtType: Democratic Monarchy
defences:
imports:
exports:
  - Veiliron Wood
  - Antiquities & Relics (Semi-legal)
  - Sulfur
  - Wheat
urls:
img: "[[placeHolderLocations.png]]"
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!map] Map
> ```leaflet
> id: Veilmoria_map_Leaflet_
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
> [!table-data]- Quest's For Veilmoria
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/Tides_of_Fates/Quests"
> WHERE lower(type) = "quest" 
> and contains(locations,[[Veilmoria]])
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