---
version: "1.0"
type: npc
icon: LiUser
iconColor: green
name: Thalena Vaer
aliases:
  - Lady Vaer
  - Queen Thalena Vaer
world: Soltpeak
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: Queen of Veilmoria, ruling from Amberhall. She came to the throne after the civil war and has spent her reign holding a fragile peace together and steering the kingdom back toward reunification with the Soltpeak Federation.
word_description: Ruler of Veilmoria
race: Humanoid
subRace: Dwarf
gender: Female
age: Middle aged
sexuality:
npc_img: "[[placeHolderNPCHumanoid.jpg]]"
condition: Alive
party_standing: Neutral
locations:
  - "[[Veilmoria]]"
  - "[[Amberhall]]"
  - "[[Soltpeak]]"
first_location:
last_seen:
class:
occupation: Queen of Veilmoria
factions:
languages:
  - Common
  - Dwarvish
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
