---
version: "1.0"
type: campaign
icon: LiBookOpen
iconColor: yellow
name: <% tp.file.title %>
aliases:
tags:
world: "[[{{VALUE:world}}]]"
date: <% tp.date.now("YYYY-MM-DD") %>
campaign: <% tp.file.folder(false) %>
status: Active
role: player
system: 5e
recurrence: {{VALUE:recurrence}}
campaign_start: {{VALUE:campaign_start}}
campaign_end:
dndbeyond_url: "{{VALUE:dndbeyond_url}}"
urls:
---
# The World of [[{{VALUE:world}}]]

> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/manager_aside");
> ```

## Player Characters
```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", { campaign: true });
```

> [!table-data]- Fallen & Missing
> ###### Dead
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/pc_condition_list", { condition: "dead" });
> ```
> ###### Missing
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/pc_condition_list", { condition: "missing" });
> ```

## Sessions

> [!table-data] Sessions
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/session_table");
> ```

## Index
```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/quest_cards", { status: "active" });
```

> [!table-data]- Quest done
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/campaign_quests", { status: "done" });
> ```

> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location"
> from "01 - Campaigns/<% tp.file.folder(false) %>/World/NPC"
> WHERE lower(type) = "npc" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Factions
>```dataview
> table word_description as "Description", faction_status as "Status", faction_type as "Type", locations as "Locations", goal as "Goal"
> from "01 - Campaigns/<% tp.file.folder(false) %>/World/Factions"
> WHERE lower(type) = "faction" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Locations
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/<% tp.file.folder(false) %>/World/Locations"
> WHERE lower(type) = "location" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Lore
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/<% tp.file.folder(false) %>/World/Lores"
> WHERE lower(type) = "lore" 
> SORT file.name ASC
> ```

---

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/coin_purse", { folder: true });
```
