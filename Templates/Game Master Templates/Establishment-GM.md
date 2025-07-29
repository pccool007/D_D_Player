---
type: establishment
tags: []
name: <% tp.file.title %>
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
description: ""
locations:
  - None
locationType:
  - Shops/Services
  - Point of Interest
pronounced: 
aliases: []
owner:
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[PlaceholderImage.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.alias` |
> **Location** | `=link(this.location)` |
> **Type** | `=this.locationType` |
> ###### Politics
>  |
> ---|---|
> **Owner(s)** | `=link(this.owner)` |

> [!info|bg-c-purple]- Description
>`=this.description`

## Map
> ```leaflet
> id: <% tp.file.title %>_establisment_map_Leaflet_
> image: [[PlaceholderImage.png]]
> height: 600px
> width: 640px
> lat: 50
> long: 50
> minZoom: 1
> maxZoom: 5
> defaultZoom: 1
> unit: meters
> scale: 1
> darkMode: false
> ```

## Associated NPC's
###### Table
```dataview
table description as "Description", alive as "Alive", playerRelations as "Relation", faction as "Factions"
from "Worlds/Lymnevia"
WHERE contains(type,"NPC") 
and contains(locations,[[<% tp.file.title %>]])
SORT file.name ASC
```
## Inventory/Services

## Other Information

## Logs

