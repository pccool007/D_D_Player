---
version: "1.0"
type: player
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
player: "{{VALUE:player}}"
level:
hp:
ac:
img: "[[placeHolderPlayer.png]]"
class: {{VALUE:class}}
description:
race: {{VALUE:race}}
subRace:
gender:
age:
sexuality:
condition: Alive
languages:
occupation:
factions:
likes:
dislikes:
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

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

## Index
---
>[!table-data]- Lores
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/lore_table", { link: "relations" });
> ```

# Player Notes

## Backstory

## Other Information

## Logs

