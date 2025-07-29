---
type: event
tags: []
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
sessionNum: <% tp.user.getThisGameNum(tp) %>
location:
- None
date: <% tp.date.now("YYYY-MM-DD") %>
description: ""
assosiatedNote: 
- None
fc-calendar: The Mistsmash
fc-date:
  year: <% tp.user.getThisDate(tp)[0] %>
  month: <% tp.user.getThisDate(tp)[1] %>
  day: <% tp.user.getThisDate(tp)[2] %>
fc-category: Events
art:
---

# [[<% tp.file.title %>]]  ( `=this.fc-date.year`-`=this.fc-date.month`-`=this.fc-date.day`)

> [!infobox]
> ###### Info
>  |
> ---|---|
> **Date** | `=this.fc-date.year`-`=this.fc-date.month`-`=this.fc-date.day` |
> **Location** | `=link(this.location)` |
> **Association** | `=link(this.assosiatedNote)` |

> [!info]- Description
> `=this.description`

## Information
Wjh