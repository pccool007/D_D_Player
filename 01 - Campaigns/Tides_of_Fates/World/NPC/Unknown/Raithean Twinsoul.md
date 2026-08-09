---
version: "1.0"
type: npc
icon: LiHelpCircle
iconColor: gray
name: Raithean Twinsoul
aliases:
  - The Twinsoul
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: "The ruler of Mara Silva. Beyond the name and the throne, almost nothing is agreed upon — those who have dealt with the fey nation speak of the Twinsoul as a presence rather than a person, and no two accounts describe the same thing."
word_description:
  - Ruler of Mara Silva
race: Unknown
subRace:
gender:
age: Unknown
sexuality:
npc_img: "[[placeHolderNPCUnknown.png]]"
condition: Alive
party_standing: Neutral
locations:
  - "[[Soltpeak]]"
  - "[[Mara Silva]]"
first_location:
last_seen:
class:
occupation: "Ruler of Mara Silva"
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
