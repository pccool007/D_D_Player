---
version: "1.0"
type: Lore
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
lore_type:
description:
relations:
secret:
locations:
icon: LiBook
iconColor: yellow
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[placeHolderLore.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.aliases` |
> **Type** | `=this.lore_type` |
> **Location** | `=this.location` |

## Information