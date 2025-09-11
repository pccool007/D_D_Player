---
version: "1.0"
type: Player
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: "<% tp.user.getFileRacineForProperties(tp) %>"
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
---
# [[<% tp.file.title %>]]
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

