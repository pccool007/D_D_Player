---
type: campaign
icon: LiBookOpen
iconColor: yellow
tags:
world: "[[Soltpeak]]"
date: 2026-07-28
status: Active
role: player
system: 5e
recurrence: 1
campaign_start: 2026-07-09
campaign_end:
dndbeyond_url: https://www.dndbeyond.com/campaigns/5491138
urls:
- "[Vault Nextcloud](https://drive.bookmaster.ca/s/WLfqS9KogqePx8H)"
- "[Google Drive](https://drive.google.com/drive/folders/11REmOmyBotKNfapNG54PAaCvbetXdAqO?usp=sharing)"
- "[Fantasy Calendar](https://app.fantasy-calendar.com/calendars/ec2cc3cb95ba823ffc28649dcfe480b5)"
- 
---
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

## Calendar

> [!table-data]+ Sol_cal
> ```custom-frames
> frame: Sol_cal
> style: height: 600px;
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
> await dv.view("00 - Config/_obsi/_obsi_views/location_table", { showType: true, typeFilter: true });
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
