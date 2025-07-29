---
type: faction
tags: []
location: 
description: ""
goal: ""
aligment: ""
name: Test Faction
world: Lymnevia
date: 2025-07-29
campaign: Tides of Faith
---
# [[Test Faction]]
## Biography Desciption

> [!todo] info

## Information


## Logs


## NPC's List

```dataview
table description as "Description", alive as "Alive"
from "Campaigns/Tides of Faith"
WHERE contains(type,"NPC") 
and contains(faction,"Test Faction")
SORT file.name ASC
```