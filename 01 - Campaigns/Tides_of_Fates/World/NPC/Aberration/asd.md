---
version: "1.0"
type: NPC
icon: LiAlien
iconColor: purple
name: asd
aliases:
world: "Soltpeak"
date: 2026-07-28
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: ""
word_description: 
race: Aberration
subRace: 
gender: Male
age: 
sexuality:
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
---
# [[asd]]

> [!infobox]
> # `=this.file.name` (`=this.aliases`)
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "npc_img", label: "NPC" });
> ```
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
> from "01 - Campaigns/Tides_of_Fates/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[asd]])
> SORT file.name ASC
> ```
## General Information
#### Inventory 

### History


### Logs
