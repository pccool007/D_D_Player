---
version: "1.0"
type: Location
name: Fortterra
aliases:
world: "[[Campaigns/Example_Campaign/World/Locations/Example_Material_Plane.md|Example_Material_Plane]]"
date: 2025-09-12
campaigns: "[[Example_Campaign]]"
tags:
locations:
icon: LiTriangle
location_type: Country
description: ""
word_description:
urls:
img: "[[placeHolderLocations.png]]"
---
# [[Fortterra]]
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
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Dimension")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- Regions
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Region")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- Countries
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Country")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- States
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"State")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- Cities
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"City")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- Other
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Other")
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

> [!table-data]- Dungeons
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> and contains(location_type,"Dungeon")
> and contains(locations,[[Fortterra]])
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
> from "Worlds/Example_Campaign/World/Establishments"
> WHERE contains(type,"establishment") 
> and contains(locations,[[Fortterra]])
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
> from "Campaigns/Example_Campaign/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[Fortterra]])
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
> from "Worlds/Example_Campaign/World/Factions"
> WHERE contains(type,"faction") 
> and contains(locations,[[Fortterra]])
> SORT file.name ASC
> ```

### Associated Quest
```button
name New Quest/Job
type command
action QuickAdd: Macro - Add Quest
```

> [!table-data]- Quest's For Fortterra
> ```dataview
> table description as "Description", owner as "Owner of the Quest", reward as "Reward", status as "Status"
> from "Campaigns/Example_Campaign/Quests"
> WHERE contains(type,"quest") 
> and contains(locations,[[Fortterra]])
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
> from "Campaigns/Example_Campaign/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[Fortterra]])
> SORT file.name ASC
> ```

## History

## Logs