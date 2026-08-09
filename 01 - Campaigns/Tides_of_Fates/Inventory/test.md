---
version: "1.0"
type: Inventory
icon: LiSword
iconColor: orange
name: test
aliases:
world: "Soltpeak"
date: 2026-08-09
campaigns: "[[Tides_of_Fates]]"
tags:
img: "[[placeHolderItem.png]]"
owner: 
description:
gold_value: 244
item_type: Weapon
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
