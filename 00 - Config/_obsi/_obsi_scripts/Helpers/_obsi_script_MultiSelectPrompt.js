// Multi-select prompt shaped like Metadata Menu's multi-value field modal:
// a question, a filter box, one row per option showing name + vault path, click
// to toggle, a check on the selected rows, and Alt+Enter to save.
//
// QuickAdd's own checkboxPrompt is a bare unlabelled checkbox list, so wizards
// that pick several notes at once use this instead.
//
// Built from plain DOM against Obsidian's own modal markup on purpose:
// require("obsidian") does not resolve from QuickAdd user scripts (same reason
// the _obsi_views modules fall back for setIcon and Notice), so nothing here may
// depend on the obsidian module or on its HTMLElement helpers.
//
// Usage (from a QuickAdd user script):
//   const path = require("path");
//   const multiSelect = require(path.join(
//       app.vault.adapter.basePath,
//       "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_MultiSelectPrompt.js"
//   ));
//   const picked = await multiSelect({
//       question: "Which factions does this NPC belong to?",
//       options: files.map(f => ({ label: f.basename, sublabel: f.path, value: f })),
//   });
//   // -> array of `value`s, empty when nothing was checked, null when cancelled
//
// NOTE: Node's require() cache means edits to this file need an Obsidian reload
// to reach QuickAdd.

const SAVE_HINT = "Alt+Enter to save";

const el = (tag, cls, parent, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
};

module.exports = ({ question, options, selected = [], filterPlaceholder = "Type to filter…" }) =>
    new Promise((resolve) => {
        const picked = new Set(selected);
        let filter = "";
        let settled = false;

        const container = el("div", "modal-container mod-dim obsiMultiSelectPrompt", document.body);
        const bg = el("div", "modal-bg", container);
        bg.style.opacity = "0.85";
        const modal = el("div", "modal", container);
        el("div", "modal-close-button", modal);
        el("div", "modal-title", modal, question);
        const content = el("div", "modal-content", modal);

        const search = el("input", "obsiMultiSelectPrompt-filter", content);
        search.type = "text";
        search.placeholder = filterPlaceholder;
        search.style.width = "100%";
        search.style.marginBottom = "var(--size-4-2)";

        const rows = el("div", "suggestion", content);
        rows.style.maxHeight = "50vh";
        rows.style.overflowY = "auto";

        const visibleOptions = () => {
            if (!filter) return options;
            return options.filter((o) =>
                `${o.label} ${o.sublabel ?? ""}`.toLowerCase().includes(filter)
            );
        };

        const renderRows = () => {
            rows.textContent = "";
            const visible = visibleOptions();
            if (!visible.length) {
                el("div", "suggestion-empty", rows, "No match");
                return;
            }
            for (const option of visible) {
                const isPicked = picked.has(option.value);
                const row = el(
                    "div",
                    `suggestion-item mod-complex${isPicked ? " is-selected" : ""}`,
                    rows
                );
                row.style.cursor = "pointer";
                const body = el("div", "suggestion-content", row);
                el("div", "suggestion-title", body, option.label);
                if (option.sublabel) el("div", "suggestion-note", body, option.sublabel);
                el("div", "suggestion-aux", row, isPicked ? "✓" : "");
                row.addEventListener("click", () => {
                    if (picked.has(option.value)) picked.delete(option.value);
                    else picked.add(option.value);
                    renderRows();
                });
            }
        };

        const footer = el("div", "modal-button-container", content);
        footer.style.display = "flex";
        footer.style.alignItems = "center";
        footer.style.justifyContent = "flex-end";
        footer.style.gap = "var(--size-4-2)";

        const hint = el("span", null, footer, SAVE_HINT);
        hint.style.marginRight = "auto";
        hint.style.color = "var(--text-accent)";
        hint.style.fontSize = "var(--font-ui-smaller)";

        const settle = (result) => {
            if (settled) return;
            settled = true;
            document.removeEventListener("keydown", onKeyDown, true);
            container.remove();
            resolve(result);
        };
        const save = () => settle(options.filter((o) => picked.has(o.value)).map((o) => o.value));
        const cancel = () => settle(null);

        const onKeyDown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); cancel(); }
            else if (event.key === "Enter" && event.altKey) { event.preventDefault(); save(); }
        };

        const button = (label, cls, onClick) => {
            const node = el("button", cls, footer, label);
            node.addEventListener("click", onClick);
            return node;
        };
        button("Save", "mod-cta", save);
        button("Cancel", null, cancel);
        button("Clear", null, () => { picked.clear(); renderRows(); });

        modal.querySelector(".modal-close-button").addEventListener("click", cancel);
        bg.addEventListener("click", cancel);
        search.addEventListener("input", () => {
            filter = search.value.toLowerCase();
            renderRows();
        });
        document.addEventListener("keydown", onKeyDown, true);

        renderRows();
        window.setTimeout(() => search.focus(), 0);
    });
