---
version: "1.0"
type: session
date: <% tp.date.now("YYYY-MM-DD") %>
tags: 
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
campaigns: "<% tp.user.getFileRacineForProperties(tp) %>"
locations: 
long_rest: false
short_rest: false
important_event: 
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

### Previous Goals
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#Goals]]

### Previous Housekeeping
![[<% tp.user._obsi_script_GetLastGameTitle(tp) %>#Housekeeping]]


---
## Post Session

### Summary

> [!tldr] [[<% tp.file.title %>]]
>
> 
>
> |     |     |
> | --- | --- |
> |  Long rest   |   `=this.long_rest`  |
> | Short rest   | `=this.short_rest`   |
>  ^summary

### Housekeeping

- [ ] 

---

## Live Notes
### Players
![[<% tp.user._obsi_script_GetFileRacine(tp) %>#^Player Characters"]]
### Session Goals
- [ ] 

## Log

