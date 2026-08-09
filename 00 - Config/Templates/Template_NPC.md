---
version: "1.0"
type: NPC
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
urls:
description: "{{VALUE:description}}"
word_description: "{{VALUE:word_description}}"
race: {{VALUE:race}}
subRace: "{{VALUE:subRace}}"
gender: {{VALUE:gender}}
age: "{{VALUE:age}}"
sexuality:
npc_img: "[[placeHolderNPC.jpg]]"
condition: Alive
party_standing: Neutral
locations: {{VALUE:locations}}
first_location: {{VALUE:first_location}}
last_seen: {{VALUE:last_seen}}
class:
occupation: "{{VALUE:occupation}}"
factions: {{VALUE:factions}}
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
