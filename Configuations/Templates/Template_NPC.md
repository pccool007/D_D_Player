---
version: "1.0"
type: NPC
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
urls:
pronounced:
description:
race:
subRace:
gender:
age:
sexuality:
alignment: Neutral
npc_img: "[[placeHolderNPC.jpg]]"
condition: Alive
party_standing: Neutral
locations:
first_locations:
class:
occupation:
factions:
languages:
likes:
dislikes:
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name` (`=this.aliases`)
> ```dataviewjs
> const img = dv.current().npc_img;
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
> **Occupation(s)** | `=this.occupation` |
> **Faction(s)** | `=link(this.factions)` |
> **Location** | `=link(this.locations)` |
>  **First Meeting Location** | `=link(this.first_locations)` |

> [!info|bg-c-purple]- Description
> `=this.description`

> [!info|bg-c-blue]- Physical Description
> TBA

> [!column|dataview] Traits
>> [!metadata|text-Center bg-c-gray] Likes/Dislikes
>> **Likes:** `=this.likes`
>>
>> **Dislikes:** `=this.dislikes`


### History


### General Information
#### Inventory 

#### Links
>[!example|bg-c-orange]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```


#### Logs

