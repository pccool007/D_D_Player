---
version: "1.0"
type: npc
icon: LiUser
iconColor: green
name: Katherine de Chatillion
aliases:
  - Queen Katherine
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: "Queen of Forterra, a noblewoman of the realm wed to the Radiant Monarch."
word_description:
  - Queen of Forterra
race: Humanoid
subRace: "Human"
gender: Female
age: "30s"
sexuality:
npc_img: "[[placeHolderNPCHumanoid.jpg]]"
condition: Alive
party_standing: Neutral
locations:
  - "[[Soltpeak]]"
  - "[[Forterra]]"
first_location:
last_seen:
class:
occupation: "Queen of Forterra"
factions:
languages:
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
