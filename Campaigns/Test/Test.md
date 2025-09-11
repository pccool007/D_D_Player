---
type: campaign
tags:
world: Soltpeak
campaign: Test
status: Active
role: player
system: 5e
dndbeyond_url:
urls:
---
# The World of Test
## Actions

>[!cards|button 7]
>```button
> name New Session Notes
> type command
> action QuickAdd: Macro - Add Session
> ```
> ```button
> name New NPC
> type command
> action QuickAdd: Macro - Add NPC
> ```
> ```button
> name New Faction
> type command
> action QuickAdd: Marco - Add Faction
> ```
>```button
> name New Quest/Job
> type command
> action QuickAdd: Macro - Add Quest
> ```
>```button
> name New Location
> type command
> action QuickAdd: Macro - Add Location
> ```
> ````button
> name New Lore
> type command
> action QuickAdd: Macro - Add Lore
> ```
> ```button
> name New Item
> type command
> action QuickAdd: Macro - Add Inventory
> ```

## Player Characters
```button
name New Player
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
> FROM "Campaigns/Test/PCs"
> WHERE contains(type, "Player") 
>AND !contains(condition, "Dead")
> ```
## Sessions

```button
name New Session Notes
type command
action QuickAdd: Macro - Add Session
```

```dataview
table important_event as "Summary", long_rest as "Long Rest"
from "Campaigns/Test/Sessions"
where contains(type,"session")
SORT sessionNum DESC
```

## Index
### Jobs & Quests
```button
name New Quest/Job
type command
action QuickAdd: Macro - Add Quest Campaign
```
###### Table Quest
```dataview
TABLE description as "Description", status as "Status", timeDelay as "Time Delay", locations as "Location", reward as "Reward", owner as "Owner"
from "Campaigns/Test"
WHERE contains(lower(type),"quest")
and !contains(status,"Done")
SORT status ASC, name ASC
```
###### Table Done Quest
```dataview
TABLE description as "Description", status as "Status", reward as "Reward"
from "Campaigns/Test"
WHERE contains(lower(type),"quest")
and contains(status,"Done")
```

### Factions
```dataview
TABLE description as "Description" from "Campaigns/Test"
WHERE contains(lower(type),"faction")
```
### NPC
```dataview
table description as "Description", faction as "Faction", locations as "Locations", party_standing as "Relation"
from "Campaigns/Test"
WHERE contains(type,"NPC")
SORT location ASC, name ASC
```
### Locations
```dataview
table description as "Description", faction as "Faction", location as "Location"
from "Campaigns/Test"
WHERE contains(type,"location")
SORT location ASC, name ASC
```