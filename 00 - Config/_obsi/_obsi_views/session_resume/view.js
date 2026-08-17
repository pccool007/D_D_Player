/* session_resume — the "Add Resume" button in a session note's infobox.
 *
 * Opens a modal with one textarea and writes what you type into the note's
 * Summary callout: the `> [!tldr] …` block that ends in `^summary`, under
 * `### Summary`. That block ref is not decoration — the NEXT session's Recap
 * embeds it as `![[<previous session>#^summary]]`, so a resume typed anywhere
 * else in the note never shows up there.
 *
 * Doing it by hand means finding the callout, prefixing every line with `> `,
 * and leaving the `^summary` line last so the ref still covers the block. This
 * does all three, and only ever touches the callout's body: the header line
 * (`> [!tldr] [[Session]]`) and the `^summary` line are put back verbatim.
 *
 * The textarea opens pre-filled with the resume already in the note, so a second
 * click edits it rather than appending a duplicate.
 *
 * A note with no `^summary` block gets a whole callout written under its
 * `### Summary` heading. A note with neither is left alone with a Notice — this
 * view guesses at nothing.
 *
 * Usage: normally reached through `note_aside`'s session schema (`actionViews`),
 * which hands it the Actions grid to render the button into.
 *
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/session_resume");
 *   ```
 *
 * Options:
 *   container : element to append the button to (default dv.container). A nested
 *               dv.view() shares the PARENT's container, so a caller with its own
 *               layout must pass the element it wants the button inside.
 *   path      : session note to write to (default the note being rendered)
 *   label     : button text (default "Add Resume")
 *   color     : button background
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
await dv.view("00 - Config/_obsi/_obsi_views/panels");
const { actionButton, promptTextarea } = globalThis.DnDPanels;

const notePath = input?.path ?? dv.currentFilePath;
const label = input?.label ?? "Add Resume";
const color = input?.color ?? "#8c3f4f";
const host = input?.container ?? dv.container;

// A quote line — the callout's own lines, `>` and `> text` alike.
const QUOTE = /^(\s*)>[ \t]?(.*)$/;
// The block ref that closes the Summary callout. Written `>  ^summary` by the
// template, but a hand-edited note may have lost a space or the `>`.
const ANCHOR = /^\s*>?\s*\^summary\s*$/;
const SUMMARY_HEADING = /^#{1,6}\s+summary\s*$/i;

const unquote = (line) => line.match(QUOTE)?.[2] ?? line;
const quote = (text) => text.split("\n").map(l => (l.trim() ? `> ${l}` : ">"));
const trimBlankLines = (text) => text.replace(/^(?:[ \t]*\n)+/, "").replace(/(?:\n[ \t]*)+$/, "");

const CALLOUT = /^\s*>\s*\[!/;
const DEFAULT_REF = ">  ^summary";

// The Summary callout as line numbers: `start` is its `[!tldr]` header, the body
// runs to `bodyEnd`, `end` closes the range to replace (exclusive) and `ref` is
// the block-ref line to put back — the note's own, so a hand-edited one is not
// silently reformatted. Null when there is no callout to rewrite.
//
// The `^summary` line is what identifies the block. A note that lost it falls
// back to the first callout under `### Summary`, so a resume replaces that one
// instead of stacking a second callout beside it.
const findCallout = (lines) => {
	const anchor = lines.findIndex(l => ANCHOR.test(l));
	if (anchor !== -1) {
		let start = anchor;
		while (start > 0 && QUOTE.test(lines[start - 1])) start--;
		return { start, bodyEnd: anchor, end: anchor + 1, ref: lines[anchor] };
	}

	const heading = lines.findIndex(l => SUMMARY_HEADING.test(l));
	if (heading === -1) return null;
	let start = heading + 1;
	while (start < lines.length && !lines[start].trim()) start++;
	if (!CALLOUT.test(lines[start] ?? "")) return null;
	let end = start;
	while (end < lines.length && QUOTE.test(lines[end])) end++;
	return { start, bodyEnd: end, end, ref: DEFAULT_REF };
};

const bodyOf = (lines, callout) => trimBlankLines(
	lines.slice(callout.start + 1, callout.bodyEnd).map(unquote).join("\n"));

const readResume = async (file) => {
	const lines = (await app.vault.cachedRead(file)).split("\n");
	const callout = findCallout(lines);
	return callout ? bodyOf(lines, callout) : "";
};

// Rebuilds the callout around `text`, keeping the shape the template writes:
// header, blank quote line, body, blank quote line, block ref.
const rewrite = (data, text) => {
	const lines = data.split("\n");
	const callout = findCallout(lines);

	if (callout) {
		lines.splice(callout.start, callout.end - callout.start,
			lines[callout.start], ">", ...quote(text), ">", callout.ref);
		return lines.join("\n");
	}

	// No callout at all — write a fresh one under the Summary heading.
	const heading = lines.findIndex(l => SUMMARY_HEADING.test(l));
	if (heading === -1) return null;
	const title = notePath.split("/").pop().replace(/\.md$/, "");
	lines.splice(heading + 1, 0,
		"", `> [!tldr] [[${title}]]`, ">", ...quote(text), ">", ">  ^summary");
	return lines.join("\n");
};

const save = async (file, text) => {
	let written = true;
	const transform = (data) => {
		const out = rewrite(data, text);
		if (out == null) { written = false; return data; }
		return out;
	};
	// vault.process is atomic; fall back to read/modify on older Obsidian builds.
	if (typeof app.vault.process === "function") {
		await app.vault.process(file, transform);
	} else {
		const data = await app.vault.read(file);
		const out = transform(data);
		if (out !== data) await app.vault.modify(file, out);
	}
	new Notice(written
		? "Session resume saved."
		: "No Summary callout or heading found in this note — nothing written.");
};

const run = async () => {
	const file = app.vault.getAbstractFileByPath(notePath);
	if (!file || file.children) { new Notice("session_resume: could not find this note."); return; }

	const current = await readResume(file);
	const text = await promptTextarea({
		title: "Session Resume",
		subtitle: "Goes into the Summary callout — this is what the next session's Recap embeds.",
		value: current,
		placeholder: "What happened this session…",
		cta: current ? "Update" : "Insert",
	});
	if (text === null) return;                       // cancelled

	// An empty box is a cancel, not "erase the resume" — clearing one is a thing to
	// do in the note, where undo works.
	const trimmed = trimBlankLines(text);
	if (!trimmed.trim()) { new Notice("Nothing typed — the resume was left as it was."); return; }

	await save(file, trimmed);
};

const btn = actionButton(host, label, color, async () => {
	btn.disabled = true;
	try {
		await run();
	} catch (e) {
		new Notice(`Session resume failed: ${e.message}`);
		console.error("session_resume", e);
	} finally {
		btn.disabled = false;
	}
});
