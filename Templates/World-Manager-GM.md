---
type: world
tags: []
world: <% tp.file.title %>
status: active
role: GM
system: 5e
---
# The World of <% tp.file.folder(false) %>
## Actions
```button
name New Locations
type command
action QuickAdd: Macro - Add Session Player
```

```button
name New Faction
type command
action QuickAdd: Macro - Add Session Player
```

```button
name New Locations
type command
action QuickAdd: Macro - Add Session Player
```

## Truths about the campaign/world

*Write down some facts about this campaign or the world that the characters find themselves in.*

- 


## Factions

```dataview
TABLE description as "Description" from "Campaigns/<% tp.file.folder(false) %>"
WHERE contains(lower(type),"faction")
```

## Custom rules

- [[Campaigns/<% tp.file.folder(false) %>/setting/Character options|Character options]]
- [[Campaigns/<% tp.file.folder(false) %>/setting/House rules|House Rules]]

## [[Safety Tools]]