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
        .pages(`"Campaigns/${campaign}/Sessions"`)
        .where(page => {
            if (page.type === 'session') {
	                totalGames = totalGames +1;
                    return true;
            }
        }).length
	return numOfGames
}

dv.table(["Campaign","System","Sessions", "Role","Status", "DNDBeyond", "Other Url"],dv.pages('"Campaigns"')
  .where(b => b.type === "campaign")
  .sort(b => b.status)
  .map(b => [dv.fileLink(b.file.path,false,[b.campaign]),b.system,getNumOfGames(b.campaign),b.role,b.status, b.dndbeyond_url, b.urls]))
```

:desert_island