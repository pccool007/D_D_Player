---
type: quest
tags: []
status: To-Do
reward: 
owner: 
timeDelay: 
locations: []
name: <% tp.file.title %>
campaign: <% tp.user.getThisCampaignName(tp) %>
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
fc-calendar: The Mistsmash
fc-date:
  year: <% tp.user.getThisDate(tp)[0] %>
  month: <% tp.user.getThisDate(tp)[1] %>
  day: <% tp.user.getThisDate(tp)[2] %>
fc-category: Sessions
description:
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name`
> ###### Info
>  |
> ---|---|
> **Status** | `=this.status` |
> **reward** | `=this.reward` |
> **owner** | `=link(this.owner)` |
> **timeDelay** | `=this.timeDelay` |
> **locations** | `=link(this.locations)` |


## Information
> [!todo] info
> `=this.description`


## Reward
> [!success] Reward
> `=this.reward`


## DM Notes
### Plot Hooks

### Hidden Details

### General Notes


### Logs