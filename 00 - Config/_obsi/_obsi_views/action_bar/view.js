/* action_bar — shared button toolbar for QuickAdd macros / Obsidian commands.
 * Renders one horizontal row of buttons. Each action is a tuple:
 *   [label, target, color, kind?]
 *     kind: "qa"  → run a QuickAdd choice by name (default)
 *           "cmd" → run an Obsidian command by name
 *
 * Replaces the Buttons-plugin ```button fences this vault used to scatter
 * everywhere: one row instead of N stacked blocks, and the choice names live
 * in one place per note.
 *
 * Usage (dataviewjs):
 *   ```dataviewjs
 *   await dv.view("00 - Config/_obsi/_obsi_views/action_bar", {
 *     actions: [
 *       ["New NPC",   "Macro - Add NPC",   "#8a5a2b"],
 *       ["New Quest", "Macro - Add Quest", "#7a6a2b"],
 *     ],
 *     compact: true,   // tighter buttons that stack — for narrow hosts (infobox)
 *   });
 *   ```
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const { actions = [], compact = false } = input ?? {};
const qa = app.plugins.plugins.quickadd?.api;
const runCmd = (name) => {
	const cmd = Object.values(app.commands.commands).find(c => c.name === name);
	cmd ? app.commands.executeCommandById(cmd.id) : new Notice("Command not found: " + name);
};
const bar = dv.container.createEl("div");
bar.style.cssText = `display:flex;flex-wrap:wrap;gap:${compact ? 4 : 8}px;margin:.25em 0;`;
for (const [label, target, color, kind = "qa"] of actions) {
	const btn = bar.createEl("button", { text: label });
	btn.style.cssText = compact
		? `flex:1 1 90px;border:none;border-radius:5px;padding:.25em .5em;cursor:pointer;` +
		  `font-weight:600;font-size:11px;line-height:1.2;white-space:nowrap;color:#f2e8d0;background:${color};`
		: `flex:1 1 auto;border:none;border-radius:6px;padding:.4em .8em;cursor:pointer;` +
		  `font-weight:600;color:#f2e8d0;background:${color};`;
	btn.onmouseenter = () => (btn.style.filter = "brightness(1.12)");
	btn.onmouseleave = () => (btn.style.filter = "");
	btn.onclick = () => kind === "cmd"
		? runCmd(target)
		: (qa?.executeChoice ? qa.executeChoice(target) : new Notice("QuickAdd API unavailable"));
}
