---
aliases: Game
---

## List of Campaigns
```button
name Add New Campaign
type command
action QuickAdd: Template - Create New Campaign
```

```dataviewjs
let totalGames;
function getNumOfGames(campaign) {
	let numOfGames = app.plugins.plugins.dataview.api
        .pages(`"Campaigns/${campaign}/sessions"`)
        .where(page => {
            if (page.type === 'session') {
                if (page.campaign === campaign) {
	                totalGames = totalGames +1;
                    return true;
                }
            }
        }).length
	return numOfGames
}

dv.table(["Campaign","System","Sessions", "Role","Status"],dv.pages('"Campaigns"')
  .where(b => b.type === "world")
  .sort(b => b.status)
  .map(b => [dv.fileLink(b.file.path,false,[b.campaign]),b.system,getNumOfGames(b.campaign),b.role,b.status]))
```

## List of Worlds
```button
name Add New World
type command
action QuickAdd: Template - Create New Campaign
```

```dataviewjs
dv.table(["Campaign","System"] ,dv.pages('"Worlds"')
  .where(b => b.type === "world")
  .map(b => [dv.fileLink(b.file.path,false,[b.name]),b.system]))
```
