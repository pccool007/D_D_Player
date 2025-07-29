---
type: Location
tags: []
summary: ""
name: "<% tp.file.title %>"
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
---
# [[<% tp.file.title %>]]

## Description 

> [!todo] info


## Establishment List

```button
name New Establisment
type command
action QuickAdd: Macro - Add a Establisment Player
```

```dataview
table summary as "Description" from "Campaigns/<% tp.user.getThisCampaignName(tp) %>"
WHERE contains(type,"establishment") 
and contains(location,"<% tp.file.title %>")
SORT file.name ASC
```
## NPC's List

```dataview
table description as "Description", alive as "Alive", playerRelations as "Relation", faction as "Factions"
from "Campaigns/<% tp.user.getThisCampaignName(tp) %>"
WHERE contains(type,"NPC") 
and contains(location,"<% tp.file.title %>")
SORT file.name ASC
```