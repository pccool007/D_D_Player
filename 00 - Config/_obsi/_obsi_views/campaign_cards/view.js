/* campaign_cards — the Active Campaigns grid on Dashboard.md.
 *
 * One rich card per active campaign: header (title + date range + meta chips +
 * a small open/pin button top-right), a left column with the next-session hero,
 * the session count, the last session and its key events, the player roster,
 * and a right column with the consistency bar and post-session status rows.
 *
 * Usage (dataviewjs):
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/campaign_cards");
 *   ```
 *
 * Options:
 *   empty : markdown rendered when no campaign is Active.
 *
 * Frontmatter it reads on the campaign note:
 *   status         — must contain "active" for the card to render
 *   world / system / role  — meta chips
 *   recurrence     — weeks between sessions (1-4, default 1) → Cadence chip
 *   campaign_start — consistency window start; falls back to the earliest
 *                    session date when unset
 *   campaign_end   — caps the window for a finished campaign
 *
 * Adapted from the GM vault: no Worlds tree and no OneShots folder here, so the
 * world is just a frontmatter link and every game is a session.
 *
 * STYLING lives in .obsidian/snippets/campaign-card.css, not here. Two things
 * follow from that:
 *   - Hover states are CSS `:hover`, not the pair of mouseenter/mouseleave
 *     listeners each button used to carry.
 *   - Colour is expressed as STATE, not as a hex code. The hero tags itself
 *     `.is-today` and the consistency block gets `data-cc-tone`; the CSS turns
 *     either into `--cc-tone` and everything inside mixes against it. The only
 *     value still pushed from JS is the bar's width, as `--cc-pct`.
 * That snippet and dnd-tokens.css (which it reads its borders and status
 * colours from) have to stay enabled in appearance.json, or these cards render
 * unstyled.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
await dv.view("00 - Config/_obsi/_obsi_views/dashboard");
const { isActive, appendValue, appendRich, toFile, openCampaign } = globalThis.DnDDash;

const el = (parent, tag, cls, text) => parent.createEl(tag, { cls: cls ?? undefined, text: text ?? undefined });

// Drop a lucide icon into `parent`. require("obsidian") often doesn't resolve
// from a dv.view() module, so the glyph fallback is a normal outcome, not a bug.
// The icon's size is set by CSS off the parent's class, not passed in here.
const icon = (parent, name, fallback) => {
	try {
		require("obsidian").setIcon(parent, name);
	} catch (e) { parent.appendText(fallback); }
	return parent;
};

const DT = dv.luxon.DateTime;
const toDT = (d) => d == null ? null : (DT.isDateTime(d) ? d : DT.fromISO(String(d).slice(0, 10)));
const today = DT.now().startOf("day");
const fmtDate = (d) => (d == null || d === "") ? null
	: (DT.isDateTime(d) ? d.toFormat("yyyy-MM-dd") : String(d).slice(0, 10));
const asArr = (v) => v == null || v === "" ? []
	: (Array.isArray(v) ? v : (v?.values ?? [v])).filter(x => x != null && x !== "");
const isType = (p, t) => dv.array(p.type).some(x => String(x).toLowerCase() === t);

const campaigns = dv.pages('"01 - Campaigns"')
	.where(p => isType(p, "campaign") && isActive(p.status))
	.array()
	.sort((a, b) => String(a.file.name).localeCompare(String(b.file.name)));

if (!campaigns.length) {
	dv.paragraph(input?.empty ?? "*No active campaigns. Set a campaign's `status` to Active to see it here.*");
} else {

const grid = el(dv.container, "div", "cc-grid");

for (const campaign of campaigns) {
	const name = String(campaign.file.name).replace(/_/g, " ");
	const folder = campaign.file.folder;

	const sessions = dv.pages(`"${folder}/Sessions"`).where(p => isType(p, "session"));
	const players = dv.pages(`"${folder}/PC"`)
		.where(p => isType(p, "player") && String(p.condition ?? "").trim().toLowerCase() === "alive");

	// ---- Last / Next split ----
	// .array() is required — DataArray.sort() takes a key fn, not a JS comparator,
	// so the (a,b) comparators below would silently no-op on a DataArray.
	const dated = sessions.array()
		.map(s => ({ s, sd: toDT(s.date ?? s.session_date) }))
		.filter(x => x.sd && x.sd.isValid);
	const playedDesc = dated.filter(x => +x.sd <= +today).sort((a, b) => +b.sd - +a.sd);
	const lastEntry = playedDesc[0];
	const nextEntry = dated.filter(x => +x.sd > +today).sort((a, b) => +a.sd - +b.sd)[0];
	const lastSession = lastEntry?.s;
	const todaySession = lastEntry && lastEntry.sd.hasSame(today, "day") ? lastEntry.s : null;

	// ---- Consistency math ----
	// The window runs campaign_start → TODAY (or campaign_end, whichever comes
	// first) — NOT up to the last played session, or skipped weeks since that
	// session would silently never be expected and the bar would read 100%.
	// Sessions due = the one on week 0 plus one per whole cadence period since.
	const recurrence = Math.max(1, Math.min(4, Number(campaign.recurrence) || 1));
	const cadenceTxt = recurrence === 1 ? "Weekly" : `Every ${recurrence} weeks`;
	const playDates = dated.map(x => x.sd);
	let start = toDT(campaign.campaign_start);
	if (!start || !start.isValid) start = playDates.length ? playDates.reduce((a, b) => +b < +a ? b : a) : null;
	const endCap = toDT(campaign.campaign_end);
	const hasEnd = endCap && endCap.isValid;
	const windowEnd = start ? (hasEnd && +endCap < +today ? endCap : today) : null;
	const counted = start ? playDates.filter(d => +d >= +start && +d <= +today && (!hasEnd || +d <= +endCap)) : [];

	let cons = { mode: "hint", hint: "" };
	if (!playDates.length) cons.hint = "— no session dates";
	else if (!start || !start.isValid) cons.hint = "— set campaign_start";
	else if (+windowEnd < +start) cons.hint = `— campaign starts ${start.toFormat("yyyy-MM-dd")}`;
	else {
		const weeks = Math.max(0, windowEnd.diff(start, "weeks").weeks);
		const expected = Math.floor(weeks / recurrence) + 1;
		const actual = counted.length;
		const missed = Math.max(0, expected - actual);
		const pct = Math.min(100, (actual / expected) * 100);
		// `tone` names the state; extra.css owns which colour that is.
		cons = { mode: "pct", pct, actual, expected, missed, tone: pct >= 95 ? "good" : pct >= 80 ? "warn" : "bad" };
	}

	// ============================ CARD ============================
	const card = el(grid, "div", "cc-card");
	const body = el(card, "div", "cc-body");

	// ---- Header ----
	const head = el(body, "div", "cc-head");
	const headL = el(head, "div", "cc-head-main");
	const titleRow = el(headL, "div", "cc-title-row");
	titleRow.createEl("a", { cls: "internal-link cc-title", text: name,
		attr: { href: campaign.file.path, "data-href": campaign.file.path } });

	const csTxt = fmtDate(campaign.campaign_start);
	const ceTxt = fmtDate(campaign.campaign_end);
	if (csTxt || ceTxt) {
		const range = csTxt && ceTxt ? `${csTxt} → ${ceTxt}` : (csTxt ? `${csTxt} →` : `→ ${ceTxt}`);
		const wrap = el(titleRow, "span", "cc-range");
		icon(el(wrap, "span", "cc-icon"), "calendar", "📅");
		el(wrap, "span", null, range);
	}

	const chips = el(headL, "div", "cc-chips");
	const metaChip = (label, value, mixed) => {
		if (value == null || value === "") return;
		const c = el(chips, "span", "cc-chip");
		el(c, "span", "cc-chip-label", label);
		const v = el(c, "span", "cc-chip-value");
		if (mixed) appendValue(v, value); else v.appendText(String(value)); // links stay clickable
	};
	metaChip("System", campaign.system, true);
	metaChip("World", campaign.world, true);
	metaChip("Role", campaign.role, true);
	metaChip("Cadence", cadenceTxt, false);

	// Open + pin the campaign (and today's session, if any) — small, top right.
	const open = head.createEl("button", { cls: "cc-open", attr: {
		title: todaySession
			? "Open this campaign + today's session in reading view and pin the tabs"
			: "Open this campaign in reading view and pin the tab" } });
	icon(open, "pin", "📌");
	open.addEventListener("click", () => openCampaign(campaign, todaySession));

	// ---- Body: two columns ----
	const bodyGrid = el(body, "div", "cc-cols");
	const left = el(bodyGrid, "div", "cc-col");

	// NEXT SESSION hero — a same-day session outranks any future one.
	const isTodayHero = !!todaySession;
	const heroEntry = isTodayHero ? lastEntry : nextEntry;
	if (heroEntry) {
		// `.is-today` flips --cc-tone from the accent to green; nothing below
		// needs to know which one it got.
		const hero = el(left, "div", `cc-hero${isTodayHero ? " is-today" : ""}`);
		const hr = el(hero, "div", "cc-hero-head");
		el(hr, "span", "cc-hero-eyebrow", isTodayHero ? "Session Today" : "Next Session");
		const dayDiff = Math.round(heroEntry.sd.startOf("day").diff(today, "days").days);
		const when = dayDiff === 0 ? "today" : dayDiff === 1 ? "tomorrow" : `in ${dayDiff} days`;
		el(hr, "span", "cc-hero-when", when);
		hero.createEl("a", { cls: "internal-link cc-hero-name", text: heroEntry.s.file.name,
			attr: { href: heroEntry.s.file.path, "data-href": heroEntry.s.file.path } });
		const hd = fmtDate(heroEntry.sd);
		if (hd) el(hero, "div", "cc-hero-date", hd);
	}

	// Session count + last session
	const row = el(left, "div", "cc-row");
	const sc = el(row, "div", "cc-count");
	el(sc, "span", "cc-count-value", String(sessions.length));
	el(sc, "span", "cc-count-label", "Sessions");

	const ls = el(row, "div", "cc-last");
	el(ls, "span", "cc-label", "Last Session");
	// When today's session is promoted to the hero, show the PRIOR game here, not a duplicate.
	const prevEntry = isTodayHero ? playedDesc[1] : lastEntry;
	if (prevEntry) {
		ls.createEl("a", { cls: "internal-link cc-last-name", text: prevEntry.s.file.name,
			attr: { href: prevEntry.s.file.path, "data-href": prevEntry.s.file.path } });
		const ld = fmtDate(prevEntry.sd);
		if (ld) el(ls, "span", "cc-last-date", ld);
		const events = asArr(prevEntry.s.important_event);
		if (events.length) {
			const evBox = el(ls, "div", "cc-events");
			el(evBox, "div", "cc-events-label", "Key Events");
			const evList = el(evBox, "ul", "cc-events-list");
			for (const ev of events) appendRich(el(evList, "li"), ev);
		}
	} else {
		el(ls, "span", "cc-empty", "— none yet");
	}

	// Players roster
	const pl = el(left, "div", null);
	const plHead = el(pl, "div", "cc-players-head");
	el(plHead, "span", "cc-label", "Players");
	el(plHead, "span", "cc-players-count", String(players.length));
	const chipsWrap = el(pl, "div", "cc-player-chips");
	for (const p of players) {
		const pn = String(p.name ?? p.file.name);
		const chip = el(chipsWrap, "span", "cc-player");
		// Avatar: the PC's portrait, falling back to its initial.
		const avatar = el(chip, "span", "cc-avatar");
		const portrait = toFile(asArr(p.img ?? p.player_img)[0], p.file.path);
		if (portrait) {
			el(avatar, "img", "cc-avatar-img").setAttribute("src", app.vault.getResourcePath(portrait));
		} else {
			avatar.appendText((pn.trim()[0] || "?").toUpperCase());
		}
		el(chip, "span", "cc-player-name", pn);
		const openPc = chip.createEl("button", { cls: "cc-player-open",
			attr: { title: `Open ${pn}'s PC note in a new tab` } });
		icon(openPc, "external-link", "↗");
		openPc.addEventListener("click", async () => {
			const f = toFile(p.file.path);
			if (f) await app.workspace.getLeaf("tab").openFile(f);
		});
	}

	// ---- Right: status panel ----
	const right = el(bodyGrid, "div", "cc-panel");

	const cwrap = el(right, "div", "cc-cons");
	const chead = el(cwrap, "div", "cc-cons-head");
	el(chead, "span", "cc-label", "Consistency");
	if (cons.mode === "pct") {
		cwrap.dataset.ccTone = cons.tone;
		// The bar's width is the one value CSS can't derive; hand it over as a
		// custom property rather than a style string.
		cwrap.style.setProperty("--cc-pct", `${cons.pct}%`);
		el(chead, "span", "cc-cons-pct", `${cons.pct.toFixed(2)}%`);
		el(el(cwrap, "div", "cc-track"), "div", "cc-fill");
		el(cwrap, "div", "cc-cons-note",
			`${cons.actual}/${cons.expected} games played` + (cons.missed ? ` · ${cons.missed} missed` : ""));
	} else {
		el(cwrap, "div", "cc-hint", cons.hint);
	}

	// Open checkboxes left over in the last played session's Log. Housekeeping was
	// a second row here until that section was dropped from the session template —
	// a header no note carries any more can only ever report "✅ Done!".
	const status = el(right, "div", "cc-status");
	const statusRow = (label, n) => {
		const r = el(status, "div", "cc-status-row");
		el(r, "span", "cc-status-label", label);
		const ok = !(n > 0);
		el(r, "span", `cc-status-value ${ok ? "is-ok" : "is-warn"}`, ok ? "✅ Done!" : `⚠️ ${n} open`);
	};
	if (lastSession) {
		const openIn = (header) => lastSession.file.tasks
			.where(t => !t.completed && t.section?.subpath === header && t.text?.trim()).length;
		statusRow("Log", openIn("Log"));
	} else {
		el(status, "div", "cc-empty", "No played session yet.");
	}
}

}
