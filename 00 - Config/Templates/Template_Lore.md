---
version: "1.0"
type: Lore
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
lore_type: {{VALUE:lore_type}}
description:
relations: {{VALUE:relations}}
secret:
locations:
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name`
> ![[placeHolderLore.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.aliases` |
> **Type** | `=this.lore_type` |
> **Location** | `=link(this.locations)` |

## Information