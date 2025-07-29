---
type: session
tags: []
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
sessionNum: <% tp.user.getThisGameNum(tp) %>
location: 
date: <% tp.date.now("YYYY-MM-DD") %>
long_rest: false
short_rest: false
summary: ""
art: ""
---
# [[<% tp.file.title %>]]

> [!infobox]
> ###### Info
>  |
> ---|---|
> **Session Number** | `=this.sessionNum` |
> **Location** | `=link(this.location)` |
> **Short Summary**  | `=this.summary` |

## Session Summary

 > [!tldr] [[<% tp.file.title %>]]
>  ^summary

---

## Recap

![[<% tp.user.getLastGameTitle(tp) %>#^summary]]


---

## Goals

- [ ] 

---

## Log

