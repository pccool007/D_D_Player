---
version: "1.0"
type: Inventory
name: <% tp.file.title %>
aliases:
world: <% tp.user._obsi_script_GetWorldName(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
owner:
description:
gold_value:
item_type:
icon: LiSword
iconColor: orange
---
# [[<% tp.file.title %>]]
