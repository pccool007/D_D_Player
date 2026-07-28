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
word_description: {{VALUE:word_description}}
race: {{VALUE:race}}
subRace: {{VALUE:subRace}}
gender: {{VALUE:gender}}
age: {{VALUE:age}}
sexuality:
npc_img: "[[placeHolderNPC.jpg]]"
condition: Alive
party_standing: Neutral
locations:{{VALUE:locations}}
first_location: {{VALUE:first_location}}
last_seen: {{VALUE:last_seen}}
class:
occupation: {{VALUE:occupation}}
factions:{{VALUE:factions}}
languages:
likes:
dislikes:
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name` (`=this.aliases`)
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "npc_img", label: "NPC" });
> ```
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
## Index
---
>[!table-data]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```

--- 
>[!table-data]- Lores
>```dataview
> table description as "Description", lore_type as "Type"
> from "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/Lores"
> WHERE contains(type,"Lore") 
> and contains(relations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```
## General Information
#### Inventory 

### History


### Logs
