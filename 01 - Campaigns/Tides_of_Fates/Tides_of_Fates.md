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
# The World of [[Soltpeak]]

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
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location"
> from "01 - Campaigns/Tides_of_Fates/World/NPC"
> WHERE lower(type) = "npc" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Factions
>```dataview
> table word_description as "Description", faction_status as "Status", faction_type as "Type", locations as "Locations", goal as "Goal"
> from "01 - Campaigns/Tides_of_Fates/World/Factions"
> WHERE lower(type) = "faction" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Locations
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World/Locations"
> WHERE lower(type) = "location" 
> SORT file.name ASC
> ```

---

> [!table-data] List of Lore
>```dataview
> table word_description as "Description", location_type as "Type"
> from "01 - Campaigns/Tides_of_Fates/World/Lores"
> WHERE lower(type) = "lore" 
> SORT file.name ASC
> ```

---

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/coin_purse", { folder: true });
```
