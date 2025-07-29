---
type: Player
currentLevel: 
campaign: <% tp.user.getThisCampaignName(tp) %>
world: <% tp.user.getThisWorld(tp) %>
date: <% tp.date.now("YYYY-MM-DD") %>
name: <% tp.file.title %>
pronounced:
aliases:
class:
image: 
url: 
tags: []
description: 
race: 
subRace: 
gender: 
age: 
sexuality: 
alignment: Neutral
condition: Alive
languages: 
 - None
locations:
  - None
occupation:
  - None
factions:
  - None
associatedReligion:
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
---
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

> [!info|bg-c-purple] Description
> `=this.description`

> [!info|bg-c-blue] Physical Description
> TBA


> [!info|bg-c-blue] Personality 
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


## Backstory

## Other Information