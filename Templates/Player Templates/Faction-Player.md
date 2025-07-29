---
type: faction
tags: []
location: 
description: ""
goal: ""
aligment: ""
name: <% tp.file.title %>
world: <% tp.user.getThisWorld(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
campaign: <% tp.user.getThisCampaignName(tp) %>
---
# [[<% tp.file.title %>]]
## Biography Desciption

> [!todo] info

## Information


## Logs


## NPC's List

```dataview
table description as "Description", alive as "Alive"
from "Campaigns/<% tp.user.getThisCampaignName(tp) %>"
WHERE contains(type,"NPC") 
and contains(faction,"<% tp.file.title %>")
SORT file.name ASC
```