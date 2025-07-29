---
type: session
tags: []
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
sessionNum: <% tp.user.getThisGameNum(tp) %>
location: []
date: <% tp.date.now("YYYY-MM-DD") %>
long_rest: false
short_rest: false
summary: ""
fc-calendar: The Mistsmash
fc-date:
  year: <% tp.user.getThisDate(tp)[0] %>
  month: <% tp.user.getThisDate(tp)[1] %>
  day: <% tp.user.getThisDate(tp)[2] %>
fc-category: Sessions
art:
---
# [[<% tp.file.title %>]]  ( `=this.fc-date.year`-`=this.fc-date.month`-`=this.fc-date.day`)

## Session Summary

> [!tldr] [[<% tp.file.title %>]]
>  ^summary

---
## Recap
### Previous Summary
![[<% tp.user.getLastGameTitle(tp) %>#^summary]]

### Previous Logs
![[<% tp.user.getLastGameTitle(tp) %>#log]]

### Previous Housekeeping
![[<% tp.user.getLastGameTitle(tp) %>#Housekeeping]]

## Strong start

> 

## Scenes

- [ ] 

## Secrets and Clues

- [ ] 

## Loot

- [ ] 

---

## Log


## Housekeeping

- [ ] 