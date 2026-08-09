// Multi-field form prompt — one modal that asks several questions at once,
// including a real date picker (<input type="date">), dropdowns and inline
// multi-select lists. QuickAdd's own API is one-prompt-at-a-time and text-only,
// so every wizard in this vault asks through this instead of a prompt chain.
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
// Field shape:
//   { key, label, description?, type?, value?, placeholder?, required?, options?,
//     disabled?, dependsOn?, optionsFor?, describe?,
//     pickerTitle?, filterPlaceholder?, emptyLabel? }
//
//   type ∈ "text" (default) | "date" | "number" | "url" | "select" | "multi"
//   options ("select" / "multi" only): [label, value] pairs — order drives the
//     dropdown order and the order values come back in. A "multi" option may add a
//     third element, [label, value, sublabel], shown as the row's subtitle in the
//     picker (the vault uses it for a note's path)
//   min / max / step apply to type "number"
//   "multi" renders a BUTTON summarising the choice — the single label when one is
//     picked, "N selected" beyond that, and `placeholder` when none are. Clicking it
//     opens _obsi_script_MultiSelectPrompt over the form; the form keeps its state
//     and resumes when the picker settles. `pickerTitle` / `filterPlaceholder` /
//     `emptyLabel` tune that modal and the button's empty text.
//   disabled: renders the row greyed and always yields "" — this is how a picker
//     with nothing to offer ("no factions in this campaign yet") stays visible
//     instead of silently vanishing from the form
//   dependsOn / optionsFor / describe: a "select" may rebuild itself from another
//     field's value. `optionsFor(value)` returns the new [label, value] pairs and
//     `describe(value)` the row's description text; both run once on open and again
//     on every change of the field named by `dependsOn`. An empty options list
//     disables the row. Used by the location form, where the parent's tier decides
//     which child types are legal.
//
// Values come back trimmed; a "multi" field yields an array of its picked values
// and every other type a string. Required fields must be non-empty before Save
// will settle; the offending row is flagged and focused instead.
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

// _obsi_script_MultiSelectPrompt, loaded on first use. It is a sibling helper, but
// requiring it at load time would mean this file could not be loaded before the
// vault adapter exists — and a `multi` field is the only thing that needs it.
let multiSelectCache;
const loadMultiSelect = () => {
    if (multiSelectCache !== undefined) return multiSelectCache;
    try {
        const path = require("path");
        multiSelectCache = require(path.join(
            (window.app ?? global.app).vault.adapter.basePath,
            "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_MultiSelectPrompt.js"
        ));
    } catch (e) {
        console.error("[FormPrompt] multi-select picker unavailable", e);
        multiSelectCache = null;
    }
    return multiSelectCache;
};

// One form row. Returns a uniform handle so the form body never branches on the
// field type again: read() for the answer, setOptions()/describe() for reactive
// rebuilds, onChange() to drive the fields that depend on this one.
//
// `host` lets a row hand the keyboard to a modal it opened on top of the form —
// without it, Esc in the picker would also cancel the form underneath, since both
// listen on document in the capture phase.
const buildRow = (field, content, host) => {
    const row = el("div", "setting-item", content);
    const info = el("div", "setting-item-info", row);
    el("div", "setting-item-name", info, field.required ? `${field.label} *` : field.label);
    const reactive = Boolean(field.dependsOn);
    const description = (field.description || reactive)
        ? el("div", "setting-item-description", info, field.description ?? "")
        : null;

    const control = el("div", "setting-item-control", row);
    const listeners = [];
    const flag = () => row.style.removeProperty("border-color");

    const setRowDisabled = (disabled) => {
        row.style.opacity = disabled ? "0.55" : "";
        return disabled;
    };

    if (field.type === "multi") {
        // A button that summarises the choice and opens the full picker
        // (_obsi_script_MultiSelectPrompt, which brings a filter box) on top of the
        // form. An inline list would grow the modal without bound — a campaign with
        // forty locations pushes Save off the bottom — and this way the form stays
        // one line per question however many notes there are.
        let picked = new Set((field.value ?? []).map(String));
        let options = field.options ?? [];
        let disabled = Boolean(field.disabled) || !options.length;

        const button = el("button", null, control);
        button.style.width = "100%";
        button.style.textAlign = "left";

        const labelOf = (value) =>
            (options.find(([, v]) => String(v) === String(value)) ?? [])[0];
        // One picked → say which. Several → say how many; listing them would not fit
        // and the picker is one click away.
        const summarise = () => {
            if (!options.length) return field.emptyLabel ?? "None available";
            const chosen = options.map(([, v]) => String(v)).filter(v => picked.has(v));
            if (!chosen.length) return field.placeholder ?? "Choose…";
            if (chosen.length === 1) return labelOf(chosen[0]) ?? chosen[0];
            return `${chosen.length} selected`;
        };
        const paint = () => { button.textContent = summarise(); };

        const openPicker = async () => {
            const multiSelect = loadMultiSelect();
            if (!multiSelect || disabled) return;
            // Hand the keyboard over, or Esc/Enter in the picker would also reach the
            // form underneath and cancel or save it.
            host.suspend();
            try {
                const chosen = await multiSelect({
                    question: field.pickerTitle ?? field.label,
                    options: options.map(([label, value, sublabel]) =>
                        ({ label, sublabel, value: String(value) })),
                    selected: options.map(([, v]) => String(v)).filter(v => picked.has(v)),
                    filterPlaceholder: field.filterPlaceholder
                        ?? `Filter ${field.label.toLowerCase()}…`,
                });
                // null is Cancel — keep what was already chosen.
                if (chosen) {
                    picked = new Set(chosen.map(String));
                    paint();
                    flag();
                    for (const fn of listeners) fn();
                }
            } finally {
                host.resume();
            }
        };

        paint();
        button.disabled = setRowDisabled(disabled);
        button.addEventListener("click", (event) => {
            event?.preventDefault?.();
            openPicker();
        });

        return {
            field,
            row,
            read: () => (disabled ? [] : options.map(([, v]) => String(v)).filter(v => picked.has(v))),
            focus: () => button.focus(),
            onChange: (fn) => listeners.push(fn),
            setOptions: (next) => {
                options = next ?? [];
                disabled = setRowDisabled(Boolean(field.disabled) || !options.length);
                button.disabled = disabled;
                paint();
            },
            setDescription: (text) => { if (description) description.textContent = text ?? ""; },
        };
    }

    let input;
    if (field.type === "select") {
        input = el("select", "dropdown", control);
        const fill = (options, keep) => {
            input.textContent = "";
            const values = [];
            for (const [label, value] of options ?? []) {
                const option = el("option", null, input, label);
                option.value = String(value);
                values.push(option.value);
            }
            input.value = values.includes(String(keep)) ? String(keep) : (values[0] ?? "");
            return values.length;
        };
        fill(field.options, field.value ?? field.options?.[0]?.[1] ?? "");
        input.disabled = setRowDisabled(Boolean(field.disabled) || !(field.options ?? []).length);
        input.addEventListener("change", () => { flag(); for (const fn of listeners) fn(); });

        return {
            field,
            row,
            read: () => (input.disabled ? "" : String(input.value ?? "").trim()),
            focus: () => input.focus(),
            onChange: (fn) => listeners.push(fn),
            setOptions: (next) => {
                // Keep what is selected when it survives the new list — switching a
                // location's parent between two same-tier parents must not silently
                // reset the type you already picked.
                const count = fill(next, input.value);
                input.disabled = setRowDisabled(Boolean(field.disabled) || !count);
            },
            setDescription: (text) => { if (description) description.textContent = text ?? ""; },
        };
    }

    input = el("input", null, control);
    input.type = field.type ?? "text";
    input.value = field.value == null ? "" : String(field.value);
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.min != null) input.min = String(field.min);
    if (field.max != null) input.max = String(field.max);
    if (field.step != null) input.step = String(field.step);
    input.style.width = "100%";
    input.disabled = setRowDisabled(Boolean(field.disabled));
    input.addEventListener("input", () => { flag(); for (const fn of listeners) fn(); });

    return {
        field,
        row,
        read: () => (input.disabled ? "" : String(input.value ?? "").trim()),
        focus: () => input.focus(),
        onChange: (fn) => listeners.push(fn),
        setOptions: () => {},
        setDescription: (text) => { if (description) description.textContent = text ?? ""; },
    };
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

        // Non-zero while a row has opened a modal on top of this one. The form keeps
        // its DOM and its answers — it is only deaf and unclickable until that modal
        // settles, so "done picking" lands you back on the form exactly as you left it.
        let suspended = 0;
        const host = {
            suspend: () => { suspended += 1; },
            resume: () => { suspended = Math.max(0, suspended - 1); },
        };

        const inputs = fields.map((field) => buildRow(field, content, host));

        // Reactive rows: rebuild from the field they depend on, now and on every
        // change of it. Wired after every row exists so order in `fields` is free.
        const byKey = new Map(inputs.map((row) => [row.field.key, row]));
        for (const row of inputs) {
            const source = byKey.get(row.field.dependsOn);
            if (!source) continue;
            const refresh = () => {
                const value = source.read();
                if (row.field.optionsFor) row.setOptions(row.field.optionsFor(value));
                if (row.field.describe) row.setDescription(row.field.describe(value));
            };
            source.onChange(refresh);
            refresh();
        }

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
            if (suspended) return;
            const answers = {};
            for (const { field, read, focus, row } of inputs) {
                const value = read();
                if (field.required && !value.length) {
                    row.style.borderColor = "var(--text-error)";
                    focus();
                    return;
                }
                answers[field.key] = value;
            }
            settle(answers);
        };
        const cancel = () => { if (!suspended) settle(null); };

        const onKeyDown = (event) => {
            if (suspended) return;
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

        window.setTimeout(() => inputs[0]?.focus(), 0);
    });
