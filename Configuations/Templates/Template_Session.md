---
version: "1.0"
type: session
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
campaign: <% tp.user.getFileRacineForProperties(tp) %>
session_num: <% tp.user._obsi_script_GetThisGameNum(tp) %>
locations:
important_event:
icon: LiBookA
iconColor: red
---
# [[<% tp.file.title %>]]

> [!infobox]
> ###### Info
>  |
> ---|---|
> **Session Number** | `=this.session_num` |
> **Location** | `=link(this.locations)` |
> **Events**  | `=this.important_event` |
>  **Date** | `=this.date`|


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
![[<% tp.user._obsi_script_GetFileRacine(tp) %>#^Player Characters"]]
### Actions
![[<% tp.user._obsi_script_GetFileRacine(tp) %>#Actions"]]

### Session_Goals
- [ ] 

## Log

