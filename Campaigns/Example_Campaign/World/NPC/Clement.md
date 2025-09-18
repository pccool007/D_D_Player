---
version: "1.0"
type: NPC
name: Clement
aliases:
world: "[[Campaigns/Example_Campaign/World/Locations/Example_Material_Plane.md|Example_Material_Plane]]"
date: 2025-09-15
campaigns: "[[Example_Campaign]]"
tags:
urls:
pronounced:
description:
word_description:
race:
subRace:
gender:
age:
sexuality:
alignment: Neutral
npc_img: "[[placeHolderNPC.jpg]]"
condition: Alive
party_standing: Neutral
locations:
first_location:
last_seen:
class:
occupation:
factions:
languages:
likes:
dislikes:
icon: LiUser
iconColor: green
---
# [[Clement]]

> [!infobox]
> # `=this.file.name` (`=this.aliases`)
> ```dataviewjs
> const img = dv.current().npc_img;
> if (img) {
>    dv.paragraph(`!${img}`); 
> } else {
>    dv.paragraph("No NPC image found.");
> }
>```
> ###### Bio
>  |
> ---|---|
> **Race** | `=this.race` (`=this.subRace`) |
> **Sex** | `=this.gender` |
> **Age** | `=this.age` |
> **Sexuality** | `=this.sexuality` |
> **Condition** | `=this.condition` |
> **Languages** | `=this.languages` |
> ###### Info
>  |
> ---|---|
> **Occupation(s)** | `=this.occupation` |
> **Faction(s)** | `=link(this.factions)` |
> **Location** | `=link(this.locations)` |
>  **First Meeting Location** | `=link(this.first_locations)` |

> [!info|bg-c-purple]- Description
> `=this.description`

> [!info|bg-c-blue]- Physical Description
> TBA

> [!column|dataview] Traits
>> [!metadata|text-Center bg-c-gray] Likes/Dislikes
>> **Likes:** `=this.likes`
>>
>> **Dislikes:** `=this.dislikes`
## Index
---
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
> and contains(relations,[[Clement]])
> SORT file.name ASC
> ```
## General Information
#### Inventory 

### History


### Logs
