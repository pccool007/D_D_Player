---
version: "1.0"
type: session
icon: LiBookA
iconColor: red
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
session_num: <% tp.user._obsi_script_GetThisGameNum(tp) %>
locations:
important_event:
---
```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/session_hero");
```

> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/note_aside");
> ```


## Recap
<%*
// Resolved once — four calls meant four Dataview queries for the same answer.
// No previous session means no embeds at all: ![[#^summary]] against a missing
// note renders as a broken embed in the finished note.
const prev = tp.user._obsi_script_GetLastGameTitle(tp);
if (prev) {
  tR += `\n### Previous Summary\n![[${prev}#^summary]]\n`;
  tR += `\n### Previous Logs\n![[${prev}#log]]\n`;
  tR += `\n### Previous Session Goals\n![[${prev}#Session_Goals]]\n`;
  tR += `\n### Previous Housekeeping\n![[${prev}#Housekeeping]]\n`;
} else {
  tR += `\n*First session in this campaign — nothing to recap yet.*\n`;
}
-%>


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
```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/quest_cards", { status: "active" });
```

## Log

