---
type: NPC
subType:
  - NPC
tags:
  - NPC
name: <% tp.file.title %>
pronounced: 
aliases: 
world: Lymnevia
date: <% tp.date.now("YYYY-MM-DD") %>
description: 
race: 
subRace: 
gender: 
age: 
sexuality: 
alignment: Neutral
condition: Dead
locations:
  - None
occupation:
  - None
factions:
  - None
associatedReligion:
  - None
languages: 
 - None
likes:
  - None
dislikes:
  - None
personalityTrait:
  - None
ideals:
  - None
flaws:
  - None
bonds:
  - None
class: 
partyStanding:
---
# [[<% tp.file.title %>]]
> [!infobox]
> # `=this.file.name` (`=this.subType`)
> **Pronounced:**  "`=this.pronounced`"
> ![[placeHolderNPC.jpg|cover hm-sm]]
> ###### Bio
>  |
> ---|---|
> **Race** | `=this.race` (`=this.subRace`) |
> **Sex** | `=this.gender` |
> **Age** | `=this.age` |
> **Sexuality** | `=this.sexuality` |
> **Alignment** | `=this.alignment` |
> **Condition** | `=this.condition` |
> **Languages** | `=this.languages` |
> ###### Info
>  |
> ---|---|
> **Alias(es)** | `=this.aliases` |
> **Occupation(s)** | `=this.occupation` |
> **Group(s)** | `=link(this.factions)` |
> **Religion(s)** | `=link(this.associatedReligion)` |
> **Current Location** | `=link(this.locations)` |

> [!info|bg-c-purple]- Description
> `=this.description`

> [!info|bg-c-blue]- Physical Description
> TBA

> [!column] Traits
>> [!metadata|text-Center bg-c-gray] Personality traits
>> `=this.personalityTrait`
>
>> [!metadata|text-Center bg-c-gray] Ideals
>> `=this.ideals`
>
>> [!metadata|text-Center bg-c-gray] Bonds
>> `=this.bonds`
>
>> [!metadata|text-Center bg-c-gray] Likes/Dislikes
>> **Likes:** `=this.likes`
>>
>> **Dislikes:** `=this.dislikes`
>
>> [!metadata|text-Center bg-c-gray] **Flaws** 
>> `=this.flaws`

> [!column|dataview] Goals
>> [!metadata|text-Center bg-c-yellow]- Personal
>> TBD
>
>> [!metadata|text-Center bg-c-yellow]- Professional
>> TBD
>

### Acquaintances
> [!column|dataview] Acquaintances
>> [!metadata|text-Center bg-c-green]- Friends & Family
>> TBD
>
>> [!metadata|text-Center bg-c-red]- Rivals
>> TBD
>

### History
TBD

### DM Notes
#### Plot Hooks

#### Hidden Details

#### General Notes

#### Inventory 

#### Statblock
```statblock
name: #`=this.file.name`
size: 
type: 
subtype: 
alignment: 
ac: 
hp: 
hit_dice: 
speed: 
stats: []
saves:
  - 
skillsaves:
  - 
damage_vulnerabilities: 
damage_resistances: 
damage_immunities: 
condition_immunities: 
senses: 
languages: 
cr: 
traits:
  - []
spells:
  - description
  - spell level: spell-list
actions:
  - []
legendary_actions:
  - []
reactions:
  - []
```
#### Logs

