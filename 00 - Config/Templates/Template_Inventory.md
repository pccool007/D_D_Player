---
version: "1.0"
type: Inventory
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
owner: {{VALUE:owner}}
description:
gold_value: {{VALUE:gold_value}}
item_type: {{VALUE:item_type}}
---
# [[<% tp.file.title %>]]
