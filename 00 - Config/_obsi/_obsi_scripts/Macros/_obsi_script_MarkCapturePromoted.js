// Closes the loop on a promote: goes back to the session note the capture came
// from and, in that one capture block:
//   1. ticks the box            ->  - [x] Promote to World NPC → [[Name]]
//   2. appends the wikilink of the note that was just created
//   3. deletes the now-dead promote-button block (an action_bar dataviewjs fence;
//      also still strips the Buttons-plugin fence older captures may carry)
//
// The tick also gives the session an outlink to the new note, and drops the
// capture out of any "pending captures" view.
//
// Last step of the four promote macros, so it only runs once the template step
// actually created the note — cancel the macro earlier and the capture is left
// untouched. Reads what ParseCapture set: capture_source_path,
// capture_block_index, capture_type and name.
//
// Safe to no-op: a missing path, an already-ticked box, or a capture that moved
// between parsing and promoting all leave the source note unchanged.
module.exports = async (params) => {
    const { app, variables } = params;

    const sourcePath = variables.capture_source_path;
    const type = variables.capture_type;
    const linkName = variables.name;
    if (!sourcePath || !type || !linkName || variables.cancelled) return;

    const file = app.vault.getAbstractFileByPath(sourcePath);
    if (!file || file.children) return;                 // missing, or a folder

    const BOX = `- [ ] Promote to World ${type}`;
    const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const transform = (data) => {
        // Same block model the parser uses: captures are fenced by --- separators
        const sections = data.split(/\n---\n/);

        let index = Number(variables.capture_block_index);
        const holdsBox = (i) =>
            Number.isInteger(i) && sections[i] != null && sections[i].includes(BOX);

        if (!holdsBox(index)) {
            // The note was edited between parsing and promoting — find the block by
            // the entity's own name line instead.
            const named = new RegExp(
                `^\\*\\*${type}:\\*\\*[ \\t]*\\[*${escapeRe(linkName)}`, "im");
            index = sections.findIndex(s =>
                s.includes(BOX) && named.test(s.replace(/^[ \t]*>+[ \t]?/gm, "")));
            if (index === -1) return data;              // nothing left to mark
        }

        sections[index] = sections[index]
            .replace(BOX, `- [x] Promote to World ${type} → [[${linkName}]]`)
            // The promote button, now an action_bar view. Matched on `action_bar`
            // specifically, and with a lookahead that cannot run past the closing
            // fence, so any OTHER dataviewjs block in the capture survives.
            .replace(/\n?```dataviewjs\n(?:(?!```)[\s\S])*?action_bar(?:(?!```)[\s\S])*?```[ \t]*\n?/g, "\n")
            // Captures written before the switch off the Buttons plugin.
            .replace(/\n?```button\n[\s\S]*?\n```[ \t]*\n?/g, "\n");

        return sections.join("\n---\n");
    };

    // vault.process is atomic; fall back to read/modify on older Obsidian builds
    if (typeof app.vault.process === "function") {
        await app.vault.process(file, transform);
    } else {
        const data = await app.vault.read(file);
        const out = transform(data);
        if (out !== data) await app.vault.modify(file, out);
    }
};
