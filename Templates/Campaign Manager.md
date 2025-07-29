---
type: campaign
tags: []
world: Lymnevia
campaign: <% tp.file.folder(false) %>
status: active
role: player
system: 5e
dndbeyond_url:
urls:
---
# The World of <% tp.file.folder(false) %>
## Actions

>[!cards|button 5]
>```button
> name New Session Notes (Player)
> type command
> action QuickAdd: Macro - Add Session Player
> ```
> ```button
> name New NPC
> type command
> action QuickAdd: Macro - Add a NPC Player
> ```
> ```button
> name New Faction
> type command
> action QuickAdd: Marco - Add New Faction Player
> ```
>```button
> name New Quest/Job
> type command
> action QuickAdd: Macro - Add new Quest Player
> ```
>```button
> name New Location
> type command
> action QuickAdd: Macro - Add a Location player
> ```

## Player Characters
```button
name New Player (ToDo)
type command
action QuickAdd: Macro - Add Player
```

> [!cards|dataview 5]
> ```dataview
> TABLE WITHOUT ID
>	(link(file.path, name)+ " \[" + age + "year\]") AS "Name",
>	emblem,
>	(race + " \[" + subRace+"\]") AS "Race",
>	(class + " \[" + currentLevel +"\]") AS "Class",
>	condition as "Condition"
> FROM "Campaigns/<% tp.file.folder(false) %>/PCs"
> WHERE contains(type, "Player") 
>AND !contains(condition, "Dead")
> ```
## Sessions

```button
name New Session Notes
type command
action QuickAdd: Macro - Add Session Player
```

```dataview
table description as "Summary", long_rest as "Long Rest", important_event as "Events"
from "Campaigns/<% tp.file.folder(false) %>/Sessions"
where contains(type,"session")
SORT sessionNum DESC
```

## Index

### Jobs & Quests


### Factions
```dataview
TABLE description as "Description" from "Campaigns/<% tp.file.folder(false) %>"
WHERE contains(lower(type),"faction")
```

### NPC

