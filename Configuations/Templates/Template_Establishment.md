---
version: "1.0"
type: Establishment
name: <% tp.file.title %>
aliases:
world: "<% tp.user._obsi_script_GetWorldName(tp) %>"
date: <% tp.date.now("YYYY-MM-DD") %>
campaigns: <% tp.user.getFileRacineForProperties(tp) %>
tags:
<%*
/**
 * Dropdown for "category"-style location types
 * One choice → fills icon + location_type
 */

const labels = [
  "Commerce & Trade",
  "Taverns & Inns",
  "Knowledge & Services",
  "Religious & Spiritual",
  "Government & Law",
  "Travel & Industry",
  "Shady & Underworld",
  "Other"
];

const keys = [
  "commerce",
  "taverns",
  "knowledge",
  "religious",
  "government",
  "travel",
  "shady",
  "other"
];

// Map your chosen icons here (Li* from Iconize, or emoji)
const map = {
  commerce:   { icon: "LiStore",        location_type: "Commerce & Trade" },
  taverns:    { icon: "LiWine",         location_type: "Taverns & Inns" },
  knowledge:  { icon: "LiBookOpen",     location_type: "Knowledge & Services" },
  religious:  { icon: "LiChurch",       location_type: "Religious & Spiritual" },
  government: { icon: "LiGavel",        location_type: "Government & Law" },
  travel:     { icon: "LiPlane",        location_type: "Travel & Industry" },
  shady:      { icon: "LiSkull",        location_type: "Shady & Underworld" },
  other:      { icon: "LiCircle",       location_type: "Other" }
};

// Show dropdown
const picked = await tp.system.suggester(labels, keys);
const sel = map[picked] ?? { icon: "LiFileQuestion", establishment_type: "Unknown" };

// Emit YAML
tR += `icon: ${sel.icon}\nestablishment_type: ${sel.location_type}`;
%>
locations:
description: ""
word_description:
owner:
pronounced:
iconColor: orange
---
# [[<% tp.file.title %>]]

> [!infobox]
> # `=this.file.name`
> **Pronounced:**  "`=this.pronounced`"
> ![[placeHolderEstablishment.png|cover hm-sm]]
> ###### Info
>  |
> ---|---|
> **Alias** | `=this.alias` |
> **Location** | `=link(this.location)` |
> **Type** | `=this.locationType` |
> ###### Politics
>  |
> ---|---|
> **Owner(s)** | `=link(this.owner)` |

> [!info|bg-c-purple]- Description
>`=this.description`

## Associated NPC's
```button
name New NPC
type command
action QuickAdd: Macro - Add NPC
```
> [!table-data] List of NPC's
>```dataview
> table embed(npc_img) AS "Portrait", word_description as "Description", condition as "Condition", party_standing as "Relation", factions as "Factions", first_location as "First Meeting Location", last_seen as "Last Seen Location"
> from "Campaigns/<% tp.user._obsi_script_GetFileRacine(tp) %>/World/NPC"
> WHERE contains(type,"NPC") 
> and contains(locations,[[<% tp.file.title %>]])
> SORT file.name ASC
> ```

## Inventory/Services

## Other Information

## Logs

