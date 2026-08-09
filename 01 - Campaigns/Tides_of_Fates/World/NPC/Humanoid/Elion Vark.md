---
version: "1.0"
type: npc
icon: LiUser
iconColor: green
name: Elion Vark
aliases:
  - High Admiral Vark
  - The Iron Flag
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: "High Admiral of the Keelward and head of the Soltpeak Federation. A career naval officer who took command when the last admiral died mid-campaign and no one else could hold the fleet together. He speaks little, and his sailors call him the Iron Flag — a flag that never comes down, no matter the storm."
word_description: "Military & Defense"
race: Humanoid
subRace: "Human"
gender: Male
age: "50s"
sexuality:
npc_img: "[[placeHolderNPCHumanoid.jpg]]"
condition: Alive
party_standing: Neutral
locations:
  - "[[Soltpeak]]"
first_location:
last_seen:
class:
occupation: "High Admiral"
factions:
  - "[[Soltpeak Federation]]"
  - "[[Keelward]]"
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
