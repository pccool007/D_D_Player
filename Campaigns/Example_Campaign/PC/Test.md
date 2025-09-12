---
version: "1.0"
type: Player
name: Test
aliases:
world: [[Campaigns/Example_Campaign/World/Locations/Example_Material_Plane.md|Example_Material_Plane]]
date: 2025-09-12
campaigns: [[Example_Campaign]]
tags:
player: ""
img: "[[placeHolderNPC.jpg]]"
class:
description:
race:
subRace:
gender:
age:
sexuality:
condition: Alive
languages:
  - None
occupation:
  - None
factions:
  - None
likes:
  - None
dislikes:
  - None
icon: LiSwords
iconColor: blue
---
# [[Test]]
> [!infobox]
> # `=this.file.name` (`=this.aliases`)
> ```dataviewjs
> const img = dv.current().img;
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
> **Alias(es)** | `=this.aliases` |
> **Occupation(s)** | `=this.occupation` |
> **Factions(s)** | `=link(this.factions)` |

> [!info|bg-c-purple] Description
> `=this.description`

> [!info|bg-c-blue] Physical Description
> TBA


> [!info|bg-c-blue] Personality 
> TBA

> [!column|dataview] Traits
>> [!metadata|text-Center bg-c-gray] Likes/Dislikes
>> **Likes:** `=this.likes`
>>
>> **Dislikes:** `=this.dislikes`
>

> [!column|dataview] Goals
>> [!metadata|text-Center bg-c-yellow] Personal
>> TBD
>
>> [!metadata|text-Center bg-c-yellow] Professional
>> TBD

# Player Notes

## Backstory

## Other Information

## Logs

