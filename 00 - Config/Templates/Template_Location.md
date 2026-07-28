---
version: "2.0"
type: Location
icon: {{VALUE:icon}}
iconColor: blue
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
locations:{{VALUE:locations}}
location_type: {{VALUE:location_type}}
location_tier_level: {{VALUE:location_tier_level}}
description: "{{VALUE:description}}"
word_description: {{VALUE:word_description}}
population:
leader: {{VALUE:leader}}
theme:
terrain: {{VALUE:terrain}}
govtType:
defences:
imports:
exports:
urls:
img: "[[placeHolderLocations.png]]"
---
# [[<% tp.file.title %>]]
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
const campaign = tp.user._obsi_script_GetFileRacine(tp);
const me = tp.file.title;
const tiers = [
  { n: 0, label: "Dimensions", type: "Dimension" },
  { n: 1, label: "Continents", type: "Continent" },
  { n: 2, label: "Regions",    type: "Regions"   },
  { n: 3, label: "Countries",  type: "Country"   },
  { n: 4, label: "States",     type: "State"     },
  { n: 5, label: "Cities",     type: "City"      }
];
for (const t of tiers) {
  if (showBelow(t.n)) {
    tR += `> [!table-data]- ${t.label}\n>\`\`\`dataview\n> table word_description as "Description", location_type as "Type"\n> from "01 - Campaigns/${campaign}/World"\n> WHERE contains(type,"Location") \n> and contains(location_type, "${t.type}")\n> and contains(locations,[[${me}]])\n> SORT file.name ASC\n> \`\`\`\n\n`;
  }
}
-%>
> [!table-data]- Other
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World"
> WHERE contains(type,"Location") 
> and !contains(location_type,"Dimension")
> and !contains(location_type,"Continent")
> and !contains(location_type,"Regions")
> and !contains(location_type,"Country")
> and !contains(location_type,"State")
> and !contains(location_type,"City")
> and !contains(location_type,"Dungeon")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC, location_type ASC
> ```

> [!table-data]- Dungeons
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World"
> WHERE contains(type,"Location") 
> and contains(location_type,"Dungeon")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### Associated Establishment 
> [!table-data]- Table Shops/Services
> ```dataview
> table description as "Description", owner as "Owner", establishment_type as "type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World"
> WHERE lower(type) = "establishment" 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.establishment_type ASC
> ```

### Associated Characters
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```


### Associated Factions 
> [!table-data]- Factions
> ```dataview
> table description as "Description"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Factions"
> WHERE contains(type,"faction") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### Associated Quest
> [!table-data]- Quest's For <% tp.file.title %>
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", status as "Status"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/Quests"
> WHERE contains(type,"quest") 
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
>```dataview
> table description as "Description", lore_type as "Type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

## History

## Logs