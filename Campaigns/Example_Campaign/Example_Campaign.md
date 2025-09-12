---
type: campaign
tags:
  - Tutorial
world: "[[Example_Material_Plane]]"
campaign: Example_Campaign
status: Active
role: player
system: 5e
dndbeyond_url: https://www.dndbeyond.com
urls:
---
# The World of Example_Campaign
## Actions
>[!cards|button 8]
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
> ```button
> name New Establishment
> type command
> action QuickAdd: Macro - Add Establishment
> ```
> ```button
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
>	 embed(img) AS "Portrait",
>	(race + " \[" + subRace+"\]") AS "Race",
>	(class) AS "Class",
>	condition as "Condition"
> FROM "Campaigns/Example_Campaign/PC"
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
table WITHOUT ID
(link(file.path, session_num)) as "Session Number", important_event as "Summary", locations as "Locations"
from "Campaigns/Example_Campaign/Sessions"
where contains(type,"session")
SORT session_num DESC
```

## Index
```button
name New Quest/Job
type command
action QuickAdd: Macro - Add Quest
```
> [!table-data] Active Quest
>```dataview
TABLE description as "Description", status as "Status", timeDelay as "Time Delay", locations as "Location", reward as "Reward", owner as "Owner"
> from "Campaigns/Example_Campaign"
> WHERE contains(lower(type),"quest")
> and !contains(quest_status,"Done")
> SORT status ASC, name ASC
> ```

> [!table-data]- Quest done
>```dataview
> TABLE description as "Description", status as "Status", reward as "Reward"
> from "Campaigns/Example_Campaign"
> WHERE contains(lower(type),"quest")
> and contains(quest_status,"Done")
> SORT status ASC, name ASC
> ```

 ```button
name New NPC
type command
action QuickAdd: Macro - Add NPC
 ```
 
> [!table-data] List of NPC's
>```dataview
> table word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location"
> from "Campaigns/Example_Campaign/World/NPC"
> WHERE contains(type,"NPC") 
> SORT file.name ASC
> ```

---

 ```button
name New Faction
type command
action QuickAdd: Marco - Add Faction
 ```

> [!table-data] List of Factions
>```dataview
> table word_description as "Description", faction_status as "Status", faction_type as "Type", locations as "Locations", goal as "Goal"
> from "Campaigns/Example_Campaign/World/Factions"
> WHERE contains(type,"Faction") 
> SORT file.name ASC
> ```

---

```button
name New Location
type command
action QuickAdd: Macro - Add Location
 ```

> [!table-data] List of Locations
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Locations"
> WHERE contains(type,"Location") 
> SORT file.name ASC
> ```

---

```button
name New Lore
type command
action QuickAdd: Macro - Add Lore
 ```

> [!table-data] List of Lore
>```dataview
> table word_description as "Description", location_type as "Type"
> from "Campaigns/Example_Campaign/World/Lores"
> WHERE contains(type,"Lore") 
> SORT file.name ASC
> ```

---

```button
name New Inventory
type command
action QuickAdd: Macro - Add Inventory
 ```

> [!table-data] List of Inventory
>```dataview
> table owner as "Weilder", description as "Description", gold_value as "Value", item_type as "Type"
> from "Campaigns/Example_Campaign/Inventory"
> WHERE contains(type,"Inventory") 
> SORT file.name ASC
> ```
