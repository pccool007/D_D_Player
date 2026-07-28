// Sending wizard — builds a [!sending] callout to insert at the cursor.
//
// Called from "00 - Config/Notes Templates/Note_Sending.md" (Templater insert,
// bound to Ctrl+G) and returns the callout text, or "" when cancelled.
//
// Three steps:
//   1. direction   — receiving or sending
//   2. other party — an NPC (World/NPC) or a Player (PC) of the current campaign
//   3. message     — textarea with a live word counter; over WORD_LIMIT words the
//                    counter turns red and a warning appears (sending only, since
//                    the 25-word cap is on what YOU cram into the spell)
//
// Your own character is resolved from the campaign's PC folder: a single PC is
// used silently, several are offered in a picker.
const WORD_LIMIT = 25;

module.exports = async (tp) => {
    const app = tp?.app || window.app;

    const active = app.workspace.getActiveFile();
    const campaignRoot = active?.path.startsWith("01 - Campaigns/")
        ? active.path.split("/").slice(0, 2).join("/")
        : null;

    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();

    const inCampaign = app.vault.getMarkdownFiles()
        .filter(f => !campaignRoot || f.path.startsWith(campaignRoot + "/"));
    const npcs = inCampaign
        .filter(f => typeOf(f) === "npc")
        .sort((a, b) => a.basename.localeCompare(b.basename));
    const pcs = inCampaign
        .filter(f => typeOf(f) === "player")
        .sort((a, b) => a.basename.localeCompare(b.basename));

    const pick = async (labels, values, placeholder) => {
        try {
            return await tp.system.suggester(labels, values, false, placeholder);
        } catch (e) {
            return null;
        }
    };

    const direction = await pick(
        ["📥  Receiving a sending", "📤  Sending a sending"],
        ["receive", "send"],
        "Sending — are you receiving or sending?"
    );
    if (!direction) return "";
    const sending = direction === "send";

    const candidates = [
        ...npcs.map(f => ({ label: `NPC · ${f.basename}`, name: f.basename })),
        ...pcs.map(f => ({ label: `Player · ${f.basename}`, name: f.basename })),
    ];
    if (!candidates.length) {
        new Notice("Sending wizard: no NPC or Player note found in this campaign.");
        return "";
    }

    const other = await pick(
        candidates.map(c => c.label),
        candidates.map(c => c.name),
        sending ? "Who are you sending to?" : "Who is sending to you?"
    );
    if (!other) return "";

    let me = pcs.length === 1 ? pcs[0].basename : null;
    if (!me && pcs.length > 1) {
        me = await pick(
            pcs.map(f => f.basename),
            pcs.map(f => f.basename),
            "Which of your characters?"
        );
        if (!me) return "";
    }

    const message = await promptMessage({
        title: sending ? `Sending to ${other}` : `Sending from ${other}`,
        subtitle: sending
            ? `A sending carries ${WORD_LIMIT} words at most.`
            : "What did they say?",
        limit: sending ? WORD_LIMIT : null,
    });
    if (message === null) return "";

    const from = sending ? (me || "You") : other;
    const to = sending ? other : (me || "You");
    const link = (name) => (name === "You" ? name : `[[${name}]]`);
    const quoted = message.trim().split("\n").join("\n> ");

    return [
        `> [!sending] Sending - ${link(from)} - ${link(to)}`,
        `> Message: ${quoted}`,
        `> Response: `,
    ].join("\n");
};

// Resolves to the typed text, or null when cancelled. Hand-rolled on Obsidian's
// modal classes rather than the Modal class, which does not reliably resolve
// through require("obsidian") from a user script.
function promptMessage({ title, subtitle, limit }) {
    return new Promise((resolve) => {
        const container = document.body.createDiv({ cls: "modal-container mod-dim" });
        const bg = container.createDiv({ cls: "modal-bg" });
        const modal = container.createDiv({ cls: "modal" });
        modal.style.width = "min(38rem, 90vw)";

        modal.createDiv({ cls: "modal-close-button" }).onclick = () => close(null);
        modal.createDiv({ cls: "modal-title", text: title });

        const content = modal.createDiv({ cls: "modal-content" });
        content.createDiv({ cls: "setting-item-description", text: subtitle });

        const textarea = content.createEl("textarea");
        textarea.rows = 5;
        textarea.style.width = "100%";
        textarea.style.marginTop = "0.75em";
        textarea.placeholder = "Type the message…";

        const counter = content.createDiv({ cls: "setting-item-description" });
        counter.style.marginTop = "0.4em";

        const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;
        const refresh = () => {
            const words = countWords(textarea.value);
            const over = limit !== null && words > limit;
            counter.setText(
                limit === null
                    ? `${words} word${words === 1 ? "" : "s"}`
                    : over
                        ? `${words} / ${limit} words — ${words - limit} over the limit`
                        : `${words} / ${limit} words`
            );
            counter.style.color = over ? "var(--text-error)" : "var(--text-muted)";
            counter.style.fontWeight = over ? "var(--font-semibold)" : "";
        };
        refresh();
        textarea.addEventListener("input", refresh);

        const buttons = modal.createDiv({ cls: "modal-button-container" });
        const insert = buttons.createEl("button", { cls: "mod-cta", text: "Insert" });
        insert.onclick = () => close(textarea.value);
        buttons.createEl("button", { text: "Cancel" }).onclick = () => close(null);

        bg.onclick = () => close(null);
        textarea.addEventListener("keydown", (evt) => {
            if (evt.key === "Enter" && (evt.ctrlKey || evt.metaKey)) {
                evt.preventDefault();
                close(textarea.value);
            }
        });
        const onKey = (evt) => {
            if (evt.key === "Escape") {
                evt.preventDefault();
                close(null);
            }
        };
        document.addEventListener("keydown", onKey);

        function close(value) {
            document.removeEventListener("keydown", onKey);
            container.remove();
            resolve(value);
        }

        textarea.focus();
    });
}
