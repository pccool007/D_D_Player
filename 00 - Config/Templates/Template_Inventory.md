---
version: "1.0"
type: inventory
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
img: "[[placeHolderItem.png]]"
owner: {{VALUE:owner}}
description:
gold_value: {{VALUE:gold_value}}
item_type: {{VALUE:item_type}}
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```

> [!info|bg-c-purple] Description
> `=this.description`

## Information

## Index
### Others
> [!table-data]- Links
> ```dataview
> TABLE without id file.inlinks AS "Links from", file.outlinks AS "Links to"
> WHERE file.path = this.file.path
> ```

## History

## Logs
