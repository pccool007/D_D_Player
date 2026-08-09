---
version: "1.0"
type: Quest
icon: {{VALUE:icon}}
iconColor: {{VALUE:iconColor}}
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
quest_status: {{VALUE:quest_status}}
reward: "{{VALUE:reward}}"
owner: {{VALUE:owner}}
time_delay:
locations: {{VALUE:locations}}
description:
---
> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```


## Information
> [!todo] info
> `=this.description`


## Reward
> [!success] Reward
> `=this.reward`


### Logs