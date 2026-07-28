/* coin_purse — currency totaler for a PC or the party.
 *
 * COIN MODE (default) — input platinum / gold / silver / copper; renders a
 * breakdown table plus a grand TOTAL always expressed in gold (gp).
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/coin_purse", { pp: 0, gp: 5, sp: 12, cp: 30 })
 *   ```
 * Frontmatter-only variant: add `pp: 3`, `gp: 50`, … to the note's YAML and
 * paste the block with no args — each omitted option falls back to the note's
 * field of the same name, then 0.
 *
 * HOARD MODE — pass `folder` to sum the `gold_value` of every Inventory note in
 * it, itemised, instead of counting coins. Used on a Campaign Manager for the
 * party's treasure.
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/coin_purse", { folder: true })
 *   ```
 *
 * Conversion (5e): 1 pp = 10 gp · 1 gp = 1 gp · 1 sp = 0.1 gp · 1 cp = 0.01 gp.
 *
 * Options:
 *   pp / gp / sp / cp : coin counts (coin mode; default 0 / frontmatter).
 *   folder            : true → this note's folder + "/Inventory"; or an explicit
 *                       folder path. Switches to hoard mode.
 *   owner             : hoard mode — keep only items whose `owner` matches this
 *                       name (default: all items in the folder).
 *   title             : heading text (default "Coin Purse" / "Party Treasure").
 *                       Pass "" to hide.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
const i = input ?? {};
const cur = (dv.current && dv.current()) || {};

const num = (v) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};
// trim trailing zeros, group thousands
const fmt = (n) => Number(n.toFixed(2)).toLocaleString("en-US");
const nameOf = (x) => (x && typeof x === "object" && x.path)
	? (x.display || x.path.split("/").pop().replace(/\.md$/, ""))
	: String(x ?? "").replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();
// keep real links as Link objects so they stay clickable; wikilink strings become links too
const linkOf = (x) => {
	if (x && typeof x === "object" && x.path) return x;
	const raw = String(x ?? "").trim();
	const wiki = raw.match(/^\[\[([^\]]+)\]\]$/);
	if (!wiki) return raw;
	const [target, display] = wiki[1].split("|");
	return dv.fileLink(target.trim(), false, (display ?? target).trim());
};

// ---- HOARD MODE ----
if (i.folder) {
	const folder = i.folder === true ? `${cur.file.folder}/Inventory` : i.folder;
	const title = i.title ?? "Party Treasure";
	const wantOwner = i.owner ? String(i.owner).toLowerCase() : null;

	let items = dv.pages(`"${folder}"`)
		.where(p => dv.array(p.type).some(t => String(t).toLowerCase() === "inventory"));
	if (wantOwner) {
		items = items.where(p => dv.array(p.owner).map(nameOf).some(o => o.toLowerCase() === wantOwner));
	}

	if (!items.length) {
		if (title) dv.header(6, title);
		dv.paragraph("*No items recorded yet.*");
		return;
	}

	const valued = items.array()
		.map(p => ({ page: p, gold: num(p.gold_value) }))
		.sort((a, b) => b.gold - a.gold);
	const total = valued.reduce((s, v) => s + v.gold, 0);

	if (title) dv.header(6, title);
	dv.paragraph(`> [!coin] Total Hoard\n> **${fmt(total)} gp** across ${valued.length} item${valued.length === 1 ? "" : "s"}`);
	dv.table(["Item", "Type", "Owner", "Description", "Value"], valued.map(v => [
		v.page.file.link,
		v.page.item_type ?? "—",
		(() => {
			const owners = dv.array(v.page.owner).map(linkOf).filter(Boolean);
			return owners.length ? owners : "—";
		})(),
		v.page.word_description ?? v.page.description ?? "—",
		v.gold ? `${fmt(v.gold)} gp` : "—",
	]));
	return;
}

// ---- COIN MODE ----
const pp = num(i.pp ?? cur.pp);
const gp = num(i.gp ?? cur.gp);
const sp = num(i.sp ?? cur.sp);
const cp = num(i.cp ?? cur.cp);

const title = i.title ?? "Coin Purse";

// everything in gold
const ppG = pp * 10;
const gpG = gp;
const spG = sp * 0.1;
const cpG = cp * 0.01;
const total = ppG + gpG + spG + cpG;

if (title) dv.header(6, title);

dv.table(
	["Coin", "Amount", "In Gold"],
	[
		["🟣 Platinum (pp)", fmt(pp), `${fmt(ppG)} gp`],
		["🟡 Gold (gp)", fmt(gp), `${fmt(gpG)} gp`],
		["⚪ Silver (sp)", fmt(sp), `${fmt(spG)} gp`],
		["🟤 Copper (cp)", fmt(cp), `${fmt(cpG)} gp`],
	]
);

dv.paragraph(`> [!coin] Total Wealth\n> **${fmt(total)} gp**`);
