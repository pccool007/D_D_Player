---
type: world
tags: []
world: Lymnevia
campaign: Tides of Faith
status: active
role: player
system:
---
# The World of Tides of Faith
## Actions

```button
name New Session Notes
type command
action QuickAdd: Macro - Add Session Player
```

```button
name New NPC
type command
action QuickAdd: Macro - Add a NPC Player
```

```button
name New Faction
type command
action QuickAdd: Marco - Add New Faction Player
```

```button
name New Quest/Job
type command
action QuickAdd: Macro - Add new Quest Player
```

```button
name New Location
type command
action QuickAdd: Macro - Add a Location player
```


## Player Characters

| Name | Character |
|:----:|:---------:|
|      |           |
|      |           |
|      |           |
|      |           |
## Sessions

```button
name New Session Notes
type command
action QuickAdd: Macro - Add Session Player
```

```dataview
table summary as "Summary" from "Campaigns/Tides of Faith/sessions"
where contains(type,"session")
SORT sessionNum ASC
```

## Index

### Jobs & Quests


## Factions

```dataview
TABLE description as "Description" from "Campaigns/Tides of Faith"
WHERE contains(lower(type),"faction")
```
