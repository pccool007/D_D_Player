---
version: "1.0"
type: session
icon: LiBookA
iconColor: red
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
campaign: <% tp.user.getFileRacineForProperties(tp) %>
session_num: <% tp.user._obsi_script_GetThisGameNum(tp) %>
locations:
important_event:
---
# [[<% tp.file.title %>]]

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/session_hero");
```

> [!infobox]
> ###### Info
>  |
> ---|---|
> **Session Number** | `=this.session_num` |
> **Location** | `=link(this.locations)` |
> **Events**  | `=this.important_event` |
>  **Date** | `=this.date`|
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/action_bar", {
>   actions: [
>     ["New NPC",           "Macro - Add NPC",           "#8a5a2b"],
>     ["New Location",      "Macro - Add Location",      "#2f6d4f"],
>     ["New Establishment", "Macro - Add Establishment", "#9c4a2e"],
>     ["New Faction",       "Macro - Add Faction",       "#6a3d9a"],
>     ["New Quest",         "Macro - Add Quest",         "#2c6e49"],
>     ["New Lore",          "Macro - Add Lore",          "#34508c"],
>     ["New Item",          "Macro - Add Inventory",     "#4f5f28"],
>   ],
>   compact: true,
> });
> ```


## Recap

### Previous Summary
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#^summary]]

### Previous Logs
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#log]]

### Previous Session Goals
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#Session_Goals]]

### Previous Housekeeping
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#Housekeeping]]


---
## Post Session

### Summary

> [!tldr] [[<% tp.file.title %>]]
>
> 
>
>  ^summary

### Housekeeping

- [ ] 

---

## Live Notes
### Players
```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", { folder: "01 - Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/PC" });
```

### Session_Goals
- [ ] 

## Quests
> [!table-data] Active Quest
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/campaign_quests", { status: "active" });
> ```

## Log

