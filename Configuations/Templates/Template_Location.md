---
version: "1.0"
type: Location
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: "<% tp.user.getFileRacineForProperties(tp) %>"
tags:
locations:
<%*
/**
 * One picker → auto-sets icon + location_type
 * Matches your defined categories + Iconize icon IDs
 */

const labels = ["City", "Country", "Regions", "Dimension", "State", "Forest", "Water", "Mountain", "Island"];
const keys   = ["city", "country", "regions", "dimension", "state", "forest", "water", "mountain", "island"];

const map = {
  city:      { icon: "LiBuilding",   location_type: "City" },
  country:   { icon: "LiTriangle",   location_type: "Country" },
  regions:   { icon: "LiRectangleHorizontal", location_type: "Regions" },
  dimension: { icon: "LiCircle",     location_type: "Dimension" },
  state:     { icon: "LiOctagon",    location_type: "State" },
  forest:    { icon: "LiTrees",      location_type: "Forest" },
  water:     { icon: "LiWaves",      location_type: "Water" },
  mountain:  { icon: "LiMountain",   location_type: "Mountain" },
  island: { icon: "desert_island", location_type: "Island" }
};

// Show a dropdown
const picked = await tp.system.suggester(labels, keys);
const sel = map[picked] ?? { icon: "LiMapPin", location_type: "Unknown" };

// Emit YAML
tR += `icon: ${sel.icon}\nlocation_type: ${sel.location_type}`;
%>
description: ""
word_description:
urls:
img: "[[placeHolderLocations.png]]"
iconColor: blue
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
```button
name New Location
type command
action QuickAdd: Macro - Add Location
 ```
> [!table-data]- Dimensions
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Dimension")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- Regions
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Region")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- Countries
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Country")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- States
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"State")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- Cities
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"City")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- Other
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Other")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

> [!table-data]- Dungeons
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Dungeon")
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### Associated Establishment 
```button
name New Establishment
type command
action QuickAdd: Macro - Add Establishment
```
> [!table-data]- Table Shops/Services
> ```dataview
> table description as "Description", owner as "Owner", establishment_type as "type"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Establishments"
> WHERE contains(type,"establishment") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.establishment_type ASC
> ```

### Associated Characters
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC
```
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```


### Associated Factions 
```button
name New Factions
type command
action QuickAdd: Macro - Add Faction
```

> [!table-data]- Factions
> ```dataview
> table description as "Description"
> from "Worlds/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Factions"
> WHERE contains(type,"faction") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

### Associated Quest
```button
name New Quest/Job
type command
action QuickAdd: Macro - Add Quest
```

> [!table-data]- Quest's For <% tp.file.title %>
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", status as "Status"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/Quests"
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
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

## History

## Logs