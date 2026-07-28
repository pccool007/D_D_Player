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
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts (Templater errors on non-module .js).
 */
await dv.view("00 - Config/_obsi/_obsi_views/dashboard");
const { isActive, appendValue, appendRich, toFile, openCampaign } = globalThis.DnDDash;

const ACCENT = "var(--interactive-accent, #4c8bf5)";
const GREEN = "#2bb34a", AMBER = "#e8923a", RED = "#e05a5a";

const el = (parent, tag, style, text) => {
	const attr = {};
	if (style) attr.style = style;
	return parent.createEl(tag, { text: text ?? undefined, attr });
};

// Drop a lucide icon into `parent`. require("obsidian") often doesn't resolve
// from a dv.view() module, so the glyph fallback is a normal outcome, not a bug.
const icon = (parent, name, fallback, size = "1em") => {
	try {
		require("obsidian").setIcon(parent, name);
		const svg = parent.querySelector("svg");
		if (svg) { svg.style.width = size; svg.style.height = size; }
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

const grid = el(dv.container, "div",
	"display:grid;grid-template-columns:repeat(auto-fit,minmax(440px,1fr));gap:20px;align-items:start;");

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
		cons = { mode: "pct", pct, actual, expected, missed, color: pct >= 95 ? GREEN : pct >= 80 ? AMBER : RED };
	}

	// ============================ CARD ============================
	const card = el(grid, "div",
		"position:relative;border:1px solid var(--background-modifier-border);border-radius:12px;" +
		"background:var(--background-primary);overflow:hidden;");
	el(card, "div", `height:3px;background:linear-gradient(90deg,${ACCENT},color-mix(in srgb,${ACCENT} 30%,transparent));`);
	const body = el(card, "div", "padding:18px 22px 22px;");

	// ---- Header ----
	const head = el(body, "div", "display:flex;align-items:flex-start;gap:12px;");
	const headL = el(head, "div", "flex:1;min-width:0;");
	const titleRow = el(headL, "div", "display:flex;align-items:baseline;flex-wrap:wrap;gap:10px 14px;");
	titleRow.createEl("a", { text: name, attr: { href: campaign.file.path, "data-href": campaign.file.path,
		class: "internal-link", style: "font-size:22px;font-weight:700;letter-spacing:-0.01em;text-decoration:none;" } });

	const csTxt = fmtDate(campaign.campaign_start);
	const ceTxt = fmtDate(campaign.campaign_end);
	if (csTxt || ceTxt) {
		const range = csTxt && ceTxt ? `${csTxt} → ${ceTxt}` : (csTxt ? `${csTxt} →` : `→ ${ceTxt}`);
		const wrap = el(titleRow, "span", "display:inline-flex;align-items:center;gap:6px;color:var(--text-muted);font-size:13px;font-weight:500;");
		icon(el(wrap, "span", "display:inline-flex;"), "calendar", "📅");
		el(wrap, "span", null, range);
	}

	const chips = el(headL, "div", "display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;");
	const metaChip = (label, value, mixed) => {
		if (value == null || value === "") return;
		const c = el(chips, "span", "display:inline-flex;align-items:baseline;gap:5px;padding:4px 10px;border-radius:6px;" +
			"background:var(--background-secondary);border:1px solid var(--background-modifier-border);font-size:12px;");
		el(c, "span", "color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em;font-size:10px;", label);
		const v = el(c, "span", "color:var(--text-normal);font-weight:600;");
		if (mixed) appendValue(v, value); else v.appendText(String(value)); // links stay clickable
	};
	metaChip("System", campaign.system, true);
	metaChip("World", campaign.world, true);
	metaChip("Role", campaign.role, true);
	metaChip("Cadence", cadenceTxt, false);

	// Open + pin the campaign (and today's session, if any) — small, top right.
	const open = head.createEl("button", { attr: {
		title: todaySession
			? "Open this campaign + today's session in reading view and pin the tabs"
			: "Open this campaign in reading view and pin the tab",
		style: `flex:none;width:34px;height:34px;padding:0;border-radius:8px;display:flex;align-items:center;` +
			`justify-content:center;cursor:pointer;border:1px solid color-mix(in srgb,${ACCENT} 35%,transparent);` +
			`background:color-mix(in srgb,${ACCENT} 12%,var(--background-secondary));color:var(--text-normal);` +
			`transition:background .12s,border-color .12s;` } });
	icon(open, "pin", "📌", "15px");
	open.addEventListener("mouseenter", () => {
		open.style.background = `color-mix(in srgb,${ACCENT} 24%,var(--background-secondary))`;
		open.style.borderColor = ACCENT;
	});
	open.addEventListener("mouseleave", () => {
		open.style.background = `color-mix(in srgb,${ACCENT} 12%,var(--background-secondary))`;
		open.style.borderColor = `color-mix(in srgb,${ACCENT} 35%,transparent)`;
	});
	open.addEventListener("click", () => openCampaign(campaign, todaySession));

	// ---- Body: two columns ----
	const bodyGrid = el(body, "div", "display:grid;grid-template-columns:1.35fr 1fr;gap:16px;margin-top:18px;align-items:stretch;");
	const left = el(bodyGrid, "div", "display:flex;flex-direction:column;gap:14px;min-width:0;");

	// NEXT SESSION hero — a same-day session outranks any future one.
	const isTodayHero = !!todaySession;
	const heroEntry = isTodayHero ? lastEntry : nextEntry;
	if (heroEntry) {
		const HERO = isTodayHero ? GREEN : ACCENT;
		const hero = el(left, "div", `position:relative;border-radius:10px;padding:14px 16px;` +
			`background:color-mix(in srgb,${HERO} 9%,var(--background-secondary));` +
			`border:1px solid color-mix(in srgb,${HERO} 28%,transparent);overflow:hidden;`);
		el(hero, "div", `position:absolute;left:0;top:0;bottom:0;width:3px;background:${HERO};`);
		const hr = el(hero, "div", "display:flex;justify-content:space-between;align-items:center;gap:10px;");
		el(hr, "span", `font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${HERO};`,
			isTodayHero ? "Session Today" : "Next Session");
		const dayDiff = Math.round(heroEntry.sd.startOf("day").diff(today, "days").days);
		const when = dayDiff === 0 ? "today" : dayDiff === 1 ? "tomorrow" : `in ${dayDiff} days`;
		el(hr, "span", `font-size:11px;font-weight:600;color:${HERO};background:color-mix(in srgb,${HERO} 16%,transparent);` +
			`padding:2px 8px;border-radius:20px;`, when);
		hero.createEl("a", { text: heroEntry.s.file.name, attr: {
			href: heroEntry.s.file.path, "data-href": heroEntry.s.file.path, class: "internal-link",
			style: "display:block;margin-top:6px;font-size:16px;font-weight:600;color:var(--text-normal);text-decoration:none;line-height:1.3;" } });
		const hd = fmtDate(heroEntry.sd);
		if (hd) el(hero, "div", "margin-top:2px;font-size:12px;color:var(--text-muted);font-variant-numeric:tabular-nums;", hd);
	}

	// Session count + last session
	const row = el(left, "div", "display:flex;gap:12px;align-items:stretch;");
	const sc = el(row, "div", "flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
		`min-width:70px;padding:8px 12px;border-radius:10px;background:var(--background-secondary);` +
		`border:1px solid var(--background-modifier-border);border-top:2px solid ${ACCENT};`);
	el(sc, "span", "font-size:26px;font-weight:700;color:var(--text-normal);line-height:1;", String(sessions.length));
	el(sc, "span", "font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin-top:4px;", "Sessions");

	const ls = el(row, "div", "flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;" +
		"padding:8px 14px;border-radius:10px;background:var(--background-secondary);border:1px solid var(--background-modifier-border);");
	el(ls, "span", "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);", "Last Session");
	// When today's session is promoted to the hero, show the PRIOR game here, not a duplicate.
	const prevEntry = isTodayHero ? playedDesc[1] : lastEntry;
	if (prevEntry) {
		ls.createEl("a", { text: prevEntry.s.file.name, attr: {
			href: prevEntry.s.file.path, "data-href": prevEntry.s.file.path, class: "internal-link",
			style: "margin-top:4px;font-size:13px;font-weight:600;color:var(--text-normal);text-decoration:none;line-height:1.3;" } });
		const ld = fmtDate(prevEntry.sd);
		if (ld) el(ls, "span", "font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;", ld);
		const events = asArr(prevEntry.s.important_event);
		if (events.length) {
			const evBox = el(ls, "div", "margin-top:7px;padding-top:6px;border-top:1px solid color-mix(in srgb,var(--background-modifier-border) 70%,transparent);");
			el(evBox, "div", "font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);margin-bottom:3px;", "Key Events");
			const evList = el(evBox, "ul", "margin:0;padding-left:15px;display:flex;flex-direction:column;gap:2px;");
			for (const ev of events)
				appendRich(el(evList, "li", "font-size:11px;color:var(--text-normal);line-height:1.35;"), ev);
		}
	} else {
		el(ls, "span", "margin-top:4px;font-size:13px;font-style:italic;color:var(--text-muted);", "— none yet");
	}

	// Players roster
	const pl = el(left, "div", null);
	const plHead = el(pl, "div", "display:flex;align-items:center;gap:8px;margin-bottom:8px;");
	el(plHead, "span", "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);", "Players");
	el(plHead, "span", "font-size:10px;font-weight:700;color:var(--text-normal);background:var(--background-secondary);" +
		"border:1px solid var(--background-modifier-border);border-radius:20px;padding:1px 7px;", String(players.length));
	const chipsWrap = el(pl, "div", "display:flex;flex-wrap:wrap;gap:6px;");
	for (const p of players) {
		const pn = String(p.name ?? p.file.name);
		const chip = el(chipsWrap, "span", "display:inline-flex;align-items:center;gap:6px;padding:4px;border-radius:20px;" +
			"background:var(--background-secondary);border:1px solid var(--background-modifier-border);font-size:12px;color:var(--text-normal);");
		// Avatar: the PC's portrait, falling back to its initial.
		const avatar = el(chip, "span", `position:relative;flex:none;display:inline-flex;align-items:center;justify-content:center;` +
			`width:20px;height:20px;border-radius:50%;overflow:hidden;` +
			`background:color-mix(in srgb,${ACCENT} 22%,var(--background-primary));color:${ACCENT};font-size:10px;font-weight:700;`);
		const portrait = toFile(asArr(p.img ?? p.player_img)[0], p.file.path);
		if (portrait) {
			el(avatar, "img", "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;")
				.setAttribute("src", app.vault.getResourcePath(portrait));
		} else {
			avatar.appendText((pn.trim()[0] || "?").toUpperCase());
		}
		el(chip, "span", "padding-left:2px;", pn);
		const openPc = chip.createEl("button", { attr: {
			title: `Open ${pn}'s PC note in a new tab`,
			style: `flex:none;width:20px;height:20px;padding:0;border-radius:50%;display:flex;align-items:center;` +
				`justify-content:center;cursor:pointer;border:1px solid color-mix(in srgb,${ACCENT} 30%,transparent);` +
				`background:color-mix(in srgb,${ACCENT} 10%,var(--background-primary));color:${ACCENT};` +
				`transition:background .12s,border-color .12s;` } });
		icon(openPc, "external-link", "↗", "12px");
		openPc.addEventListener("mouseenter", () => {
			openPc.style.background = `color-mix(in srgb,${ACCENT} 22%,var(--background-primary))`;
			openPc.style.borderColor = ACCENT;
		});
		openPc.addEventListener("mouseleave", () => {
			openPc.style.background = `color-mix(in srgb,${ACCENT} 10%,var(--background-primary))`;
			openPc.style.borderColor = `color-mix(in srgb,${ACCENT} 30%,transparent)`;
		});
		openPc.addEventListener("click", async () => {
			const f = toFile(p.file.path);
			if (f) await app.workspace.getLeaf("tab").openFile(f);
		});
	}

	// ---- Right: status panel ----
	const right = el(bodyGrid, "div", "display:flex;flex-direction:column;gap:12px;border-radius:10px;" +
		"background:var(--background-secondary);border:1px solid var(--background-modifier-border);padding:14px 16px;");

	const cwrap = el(right, "div", null);
	const chead = el(cwrap, "div", "display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;");
	el(chead, "span", "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);", "Consistency");
	if (cons.mode === "pct") {
		el(chead, "span", `font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:${cons.color};`, `${cons.pct.toFixed(2)}%`);
		const track = el(cwrap, "div", "height:7px;border-radius:5px;background:var(--background-primary);overflow:hidden;");
		el(track, "div", `height:100%;border-radius:5px;width:${cons.pct}%;background:${cons.color};`);
		el(cwrap, "div", "margin-top:6px;font-size:11px;color:var(--text-muted);",
			`${cons.actual}/${cons.expected} games played` + (cons.missed ? ` · ${cons.missed} missed` : ""));
	} else {
		const hintBox = el(cwrap, "div", "display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;" +
			"background:var(--background-primary);border:1px dashed var(--background-modifier-border);");
		el(hintBox, "span", "font-size:11px;font-style:italic;color:var(--text-muted);line-height:1.4;", cons.hint);
	}

	el(right, "div", "height:1px;background:var(--background-modifier-border);");

	// Open checkboxes left over in the last played session's wrap-up sections.
	const status = el(right, "div", "display:flex;flex-direction:column;gap:8px;");
	const statusRow = (label, n) => {
		const r = el(status, "div", "display:flex;align-items:center;justify-content:space-between;gap:10px;" +
			"padding:8px 12px;border-radius:8px;background:var(--background-primary);");
		el(r, "span", "font-size:12px;font-weight:600;color:var(--text-muted);", label);
		const ok = !(n > 0);
		el(r, "span", `font-size:12px;font-weight:600;color:${ok ? GREEN : AMBER};`, ok ? "✅ Done!" : `⚠️ ${n} open`);
	};
	if (lastSession) {
		const openIn = (header) => lastSession.file.tasks
			.where(t => !t.completed && t.section?.subpath === header && t.text?.trim()).length;
		statusRow("Housekeeping", openIn("Housekeeping"));
		statusRow("Log", openIn("Log"));
	} else {
		el(status, "div", "font-size:11px;font-style:italic;color:var(--text-muted);padding:2px;", "No played session yet.");
	}
}

}
