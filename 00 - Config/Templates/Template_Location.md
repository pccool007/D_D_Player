---
version: "2.0"
type: location
icon: {{VALUE:icon}}
iconColor: blue
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
locations: {{VALUE:locations}}
location_type: {{VALUE:location_type}}
location_tier_level: {{VALUE:location_tier_level}}
description: "{{VALUE:description}}"
word_description: "{{VALUE:word_description}}"
population:
leader: {{VALUE:leader}}
theme:
terrain: "{{VALUE:terrain}}"
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

> [!info|bg-c-purple] Description
>`=this.description`
## Index
### Associated Locations
<%*
const _rawTier = "{{VALUE:location_tier_level}}";
const myTier = _rawTier === "" ? null : parseInt(_rawTier, 10);
const showBelow = (tier) => myTier !== null && !isNaN(myTier) && myTier < tier;
const tiers = [
  { n: 0, label: "Dimensions", type: "Dimension" },
  { n: 1, label: "Continents", type: "Continent" },
  { n: 2, label: "Regions",    type: "Region"    },
  { n: 3, label: "Countries",  type: "Country"   },
  { n: 4, label: "States",     type: "State"     },
  { n: 5, label: "Cities",     type: "City"      }
];
for (const t of tiers) {
  if (showBelow(t.n)) {
    // The view resolves campaign and identity at render time, so nothing about
    // this note gets baked in — renaming it no longer empties its own tables.
    tR += `> [!table-data]- ${t.label}\n> \`\`\`dataviewjs\n> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { link: "locations", type: "${t.type}" });\n> \`\`\`\n\n`;
  }
}
-%>
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
> [!table-data]- Quest's For <% tp.file.title %>
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", quest_status as "Status"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/Quests"
> WHERE lower(type) = "quest" 
> and contains(locations,[[<% tp.file.title %>]])
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