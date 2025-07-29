---
type: quest
status: 
- To-Do
- In Progress
- Done
reward: 
description:
owner: 
timeDelay: 
locations:
- None
name: "<% tp.file.title %>"
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
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


