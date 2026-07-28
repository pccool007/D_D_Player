---
aliases:
  - Home
type: dashboard
icon: LiLayoutDashboard
iconColor: blue
cssclasses:
  - dashboard
---
# Dashboard

> [!infobox]
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/manager_aside", {
>   kind: "vault",
>   actionGroups: [
>     ["Create", [
>       ["New Campaign", "Macro - Create Campaign", "#56606e"],
>     ]],
>   ],
> });
> ```

## Stats

```dataviewjs
const TYPES = [
  ["Campaigns",  "campaign",      "#c9a24b"],
  ["Sessions",   "session",       "#81c784"],
  ["Characters", "player",        "#64b5f6"],
  ["NPCs",       "npc",           "#ffb74d"],
  ["Factions",   "faction",       "#e57373"],
  ["Locations",  "location",      "#a5d6a7"],
  ["Establish.", "establishment", "#ba68c8"],
  ["Lore",       "lore",          "#7986cb"],
  ["Quests",     "quest",         "#2c6e49"],
  ["Items",      "inventory",     "#4db6ac"],
];
const pages = dv.pages('"01 - Campaigns"');
const count = (t) => pages.where(p => dv.array(p.type).some(x => String(x).toLowerCase() === t)).length;

const bar = dv.container.createEl("div", { attr: { style:
  "display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:.4rem;margin:.3rem 0 .6rem;" } });
for (const [label, type, color] of TYPES) {
  const tile = bar.createEl("div", { attr: { style:
    `padding:.5rem .3rem;text-align:center;background:var(--background-secondary);` +
    `border:1px solid var(--background-modifier-border);border-top:3px solid ${color};border-radius:8px;` } });
  tile.createEl("div", { text: String(count(type)), attr: { style:
    "font-size:1.4rem;font-weight:700;line-height:1.1;color:var(--text-normal);" } });
  tile.createEl("div", { text: label, attr: { style:
    "font-size:.58rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);margin-top:2px;" } });
}
```

## Search

> [!table-data] Search everything
> ```dataviewjs
> await dv.view("00 - Config/_obsi/_obsi_views/table_search", {
>   from: '"01 - Campaigns"',
>   where: p => dv.array(p.type).some(t => !["campaign", "session"].includes(String(t).toLowerCase())),
>   headers: ["Type", "Campaign", "Description"],
>   row: p => [
>     dv.array(p.type).join(", "),
>     (p.file.path.match(/^01 - Campaigns\/([^/]+)\//) ?? [])[1]?.replace(/_/g, " ") ?? "—",
>     p.word_description ?? p.description ?? "—",
>   ],
>   sort: [p => String(dv.array(p.type)[0] ?? ""), p => p.file.name],
>   limit: 15,
>   placeholder: "Search NPCs, locations, factions, lore, quests, items…",
>   searchText: p => [p.race, p.location_type, p.faction_type, p.lore_type, p.item_type, p.establishment_type],
>   filters: [{ label: "Type", value: p => dv.array(p.type) }],
>   requireQuery: true,
> });
> ```

## Active Campaigns

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/campaign_cards");
```


## Campaigns

```dataviewjs
const countSessions = (folder) => dv.pages(`"${folder}/Sessions"`)
  .where(p => dv.array(p.type).some(t => String(t).toLowerCase() === "session")).length;

// A URL never contains whitespace, so scrubbing it keeps the cell clickable even
// when a wrapped paste left a stray space behind ("https: //host/…").
const cleanHref = (s) => String(s).replace(/\s+/g, "");
const urlCell = (value) => {
  const items = dv.array(value).map(u => {
    const s = String(u);
    const m = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (m) return `[${m[1].trim()}](${cleanHref(m[2])})`;
    const href = cleanHref(s);
    return /^https?:\/\//.test(href) ? `[${href.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}](${href})` : s;
  });
  return items.length ? items.join("<br>") : "—";
};

const rows = dv.pages('"01 - Campaigns"')
  .where(p => dv.array(p.type).some(t => String(t).toLowerCase() === "campaign"))
  .sort(p => String(p.status ?? ""))
  .map(p => [
    dv.fileLink(p.file.path, false, String(p.file.name).replace(/_/g, " ")),
    p.world ?? "—",
    p.system ?? "—",
    countSessions(p.file.folder),
    p.role ?? "—",
    p.status ?? "—",
    p.dndbeyond_url ? urlCell(p.dndbeyond_url) : "—",
    urlCell(p.urls),
  ]);

dv.table(["Campaign", "World", "System", "Sessions", "Role", "Status", "D&D Beyond", "Other URLs"], rows);
```

## My Characters

```dataviewjs
await dv.view("00 - Config/_obsi/_obsi_views/pc_roster", {
  folder: "01 - Campaigns",
  condition: null,
  where: p => dv.array(p.player).some(x => {
    const n = (x && typeof x === "object" && x.path)
      ? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
      : String(x).replace(/^\[\[|\]\]$/g, "").split("|").pop();
    return n.trim().toLowerCase() === "me";
  }),
  showCampaign: true,
  empty: "*No characters of yours yet — run **New Player** from a campaign and set `player: Me`.*",
});
```
