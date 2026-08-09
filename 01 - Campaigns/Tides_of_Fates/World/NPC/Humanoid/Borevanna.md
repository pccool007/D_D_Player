---
version: "1.0"
type: npc
icon: LiUser
iconColor: green
name: Borevanna
aliases:
  - The Snow Witch
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
urls:
description: "Known to most as the Snow Witch, Borevanna is a figure shrouded in myth and half-truths. She wanders Soltpeak like a drifting storm, feared and admired in equal measure. Some remember her as a savior who parted blizzards or led the lost to safety; others whisper of manipulations and cold designs. She keeps her distance from kings and courts, weaving her own path free of crowns and banners, and to meet her is to feel both awe and unease — as though one stood before the living embodiment of winter itself."
word_description:
  - Myth and Half-Truths
  - Wandering Storm
race: Humanoid
subRace:
gender: Female
age: Unknown
sexuality:
npc_img: "[[placeHolderNPCHumanoid.jpg]]"
condition: Missing
party_standing: Neutral
locations:
  - "[[Soltpeak]]"
first_location:
last_seen:
class:
occupation:
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
