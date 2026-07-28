// Multi-field form prompt — one modal that asks several questions at once,
// including a real date picker (<input type="date">) and dropdowns. QuickAdd's
// own API is one-prompt-at-a-time and text-only, so wizards that need a small
// structured form (CampaignWizard) use this instead.
//
// Built from plain DOM against Obsidian's own modal markup on purpose, for the
// same reason as _obsi_script_MultiSelectPrompt.js: require("obsidian") does not
// resolve from QuickAdd user scripts, so nothing here may depend on the obsidian
// module or on its HTMLElement helpers.
//
// Usage (from a QuickAdd user script):
//   const path = require("path");
//   const formPrompt = require(path.join(
//       app.vault.adapter.basePath,
//       "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_FormPrompt.js"
//   ));
//   const answers = await formPrompt({
//       title: "New campaign",
//       fields: [
//           { key: "campaign",      label: "Campaign name", required: true },
//           { key: "campaign_start", label: "Start date",   type: "date", value: today },
//           { key: "recurrence",    label: "Cadence", type: "select",
//             value: "1", options: [["Weekly", "1"], ["Every 2 weeks", "2"]] },
//       ],
//   });
//   // -> { campaign: "…", campaign_start: "…", recurrence: "1" }, null when cancelled
//
// Field shape: { key, label, description?, type?, value?, placeholder?, required?, options? }
//   type ∈ "text" (default) | "date" | "number" | "url" | "select"
//   options (select only): [label, value] pairs — order drives the dropdown order
//   min / max / step apply to type "number"
//
// Every value comes back as a trimmed string. Required fields must be non-empty
// before Save will settle; the offending row is flagged and focused instead.
//
// NOTE: Node's require() cache means edits to this file need an Obsidian reload
// to reach QuickAdd.

const SAVE_HINT = "Enter to save · Esc to cancel";

const el = (tag, cls, parent, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
};

module.exports = ({ title, fields = [], saveLabel = "Create" }) =>
    new Promise((resolve) => {
        let settled = false;

        const container = el("div", "modal-container mod-dim obsiFormPrompt", document.body);
        const bg = el("div", "modal-bg", container);
        bg.style.opacity = "0.85";
        const modal = el("div", "modal", container);
        el("div", "modal-close-button", modal);
        el("div", "modal-title", modal, title);
        const content = el("div", "modal-content", modal);
        content.style.maxHeight = "60vh";
        content.style.overflowY = "auto";

        const inputs = fields.map((field) => {
            const row = el("div", "setting-item", content);
            const info = el("div", "setting-item-info", row);
            el("div", "setting-item-name", info, field.required ? `${field.label} *` : field.label);
            if (field.description) el("div", "setting-item-description", info, field.description);

            const control = el("div", "setting-item-control", row);
            let input;
            if (field.type === "select") {
                input = el("select", "dropdown", control);
                for (const [label, value] of field.options ?? []) {
                    const option = el("option", null, input, label);
                    option.value = String(value);
                }
                input.value = String(field.value ?? (field.options?.[0]?.[1] ?? ""));
            } else {
                input = el("input", null, control);
                input.type = field.type ?? "text";
                input.value = field.value == null ? "" : String(field.value);
                if (field.placeholder) input.placeholder = field.placeholder;
                if (field.min != null) input.min = String(field.min);
                if (field.max != null) input.max = String(field.max);
                if (field.step != null) input.step = String(field.step);
                input.style.width = "100%";
            }
            input.addEventListener("input", () => (row.style.removeProperty("border-color")));
            return { field, input, row };
        });

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

        const save = () => {
            const answers = {};
            for (const { field, input, row } of inputs) {
                const value = String(input.value ?? "").trim();
                if (field.required && !value) {
                    row.style.borderColor = "var(--text-error)";
                    input.focus();
                    return;
                }
                answers[field.key] = value;
            }
            settle(answers);
        };
        const cancel = () => settle(null);

        const onKeyDown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); cancel(); }
            else if (event.key === "Enter") { event.preventDefault(); save(); }
        };

        const button = (label, cls, onClick) => {
            const node = el("button", cls, footer, label);
            node.addEventListener("click", onClick);
            return node;
        };
        button(saveLabel, "mod-cta", save);
        button("Cancel", null, cancel);

        modal.querySelector(".modal-close-button").addEventListener("click", cancel);
        bg.addEventListener("click", cancel);
        document.addEventListener("keydown", onKeyDown, true);

        window.setTimeout(() => inputs[0]?.input.focus(), 0);
    });
