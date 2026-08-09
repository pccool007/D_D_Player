---
version: "1.0"
type: NPC
icon: LiCpu
iconColor: gray
name: Bob
aliases:
  - asd
world: Soltpeak
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: adssdqd
word_description:
  - assd
  - asd
  - asd
race: Construct
subRace: ss
gender: Male
age: ""
sexuality:
npc_img: "[[placeHolderNPC.jpg]]"
condition: Alive
party_standing: Neutral
locations: ["[[Amberhall]]", "[[Soltpeak]]"]
first_location: "[[Amberhall]]"
last_seen: "[[Amberhall]]"
class: fighter
occupation: King of land
factions:
  - "[[tesafsd]]"
languages: common
likes:
dislikes:
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

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
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/lore_table", { link: "relations" });
> ```
## General Information
#### Inventory 

### History


### Logs
