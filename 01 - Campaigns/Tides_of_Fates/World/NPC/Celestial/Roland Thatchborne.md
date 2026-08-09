---
version: "1.0"
type: npc
icon: LiSun
iconColor: yellow
name: Roland Thatchborne
aliases:
  - The Radiant Monarch
world: Soltpeak
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: A gutter orphan turned warlord, crowned King of Forterra by the raised swords of the people he freed. He ruled for forty years, died, and returned as a celestial flame — the Radiant Monarch, eternal guardian of Forterra. He speaks softly and rules with a commoner's heart, and those who stand near the throne say an old grief sits behind every decision he makes.
word_description:
  - Reborn Flame
  - Celestial Guardian
race: Celestial
subRace: Human
gender: Male
age: ~400s
sexuality: Unknown
npc_img: "[[placeHolderNPCCelestial.jpg]]"
condition: Alive
party_standing: Neutral
locations:
  - "[[Soltpeak]]"
  - "[[Forterra]]"
first_location:
last_seen:
class:
occupation: King of Forterra
factions:
  - "[[The Brotherhood of light]]"
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
