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
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/npc_table");
> ```

---

> [!table-data] List of Factions
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/faction_table");
> ```

---

> [!table-data] List of Locations
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { showType: true });
> ```

---

> [!table-data] List of Lore
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/lore_table");
> ```

---

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/coin_purse", { folder: true });
```
