---
version: "1.0"
tags: 
type: quest
quest_status: To Do
reward: 
owner: 
time_delay: 
locations: 
name: <% tp.file.title %>
campaign: "<% tp.user._obsi_script_GetFileRacineHeader(tp) %>"
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
description:
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name`
> ###### Info
>  |
> ---|---|
> **Status** | `=this.quest_status` |
> **reward** | `=this.reward` |
> **owner** | `=link(this.owner)` |
> **timeDelay** | `=this.time_delay` |
> **locations** | `=link(this.locations)` |


## Information
> [!todo] info
> `=this.description`


## Reward
> [!success] Reward
> `=this.reward`


### Logs