/* image_upload — button that copies an image off the OS into the vault's assets,
 * campaign-scoped, and optionally writes the link into the note's frontmatter.
 *
 * Destination is 00 - Config/_obsi/assets/{campaign}/, the campaign taken from the
 * host note's own path. A note outside 01 - Campaigns/ (Dashboard, README, a config
 * note) falls back to the assets root with no subfolder.
 *
 * The written link is a FULL vault path, not a bare filename: two campaigns can each
 * hold a "Grug.png" and a bare wikilink would resolve to whichever Obsidian picked.
 * infobox_img (`!${img}`) and Dataview's embed() both take full paths.
 *
 * Usage (dataviewjs) — normally reached through infobox_img / manager_aside rather
 * than called directly:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/image_upload", { field: "npc_img" });
 *   > ```
 *
 * Options:
 *   field   : frontmatter key to set once the copy lands ("img", "npc_img", …).
 *             Omit for upload-only — the Campaign Manager case, where the note has
 *             no image field and nothing should be written to it.
 *   label   : button text (default "Set image", or "Upload image" with no `field`).
 *   color   : button background (default the muted stone of the other action rows).
 *   compact : tighter button for narrow hosts, matching action_bar's flag.
 *   width   : CSS width for the button (default "100%" compact, else "auto").
 *   container : element to append the button to. A nested dv.view() shares the
 *             PARENT's dv.container, so a caller that builds its own layout
 *             (manager_aside's panels) must pass the element it wants the button
 *             inside — otherwise it lands at the bottom of the whole view.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const CAMPAIGNS_ROOT = "01 - Campaigns";
const ASSETS_ROOT = "00 - Config/_obsi/assets";

const field = input?.field ?? null;
const label = input?.label ?? (field ? "Set image" : "Upload image");
const color = input?.color ?? "#4a4a52";
const compact = input?.compact ?? false;

const notePath = dv.current()?.file?.path ?? "";
const noteBase = (notePath.split("/").pop() ?? "").replace(/\.md$/, "");

// Campaign only when the note actually sits under the campaigns tree. The older
// path helpers (_obsi_script_GetFileRacine, SetParamsInCapGetCampaignFolder) skip
// this guard and produce "01 - Campaigns/undefined" when run off-tree.
const segments = notePath.split("/");
const campaign = segments[0] === CAMPAIGNS_ROOT ? segments[1] : null;
const targetDir = campaign ? `${ASSETS_ROOT}/${campaign}` : ASSETS_ROOT;

const extensionOf = (name) => {
	const dot = name.lastIndexOf(".");
	return dot > 0 ? name.slice(dot).toLowerCase() : "";
};

const splitExtension = (name) => {
	const ext = extensionOf(name);
	return [ext ? name.slice(0, -ext.length) : name, ext];
};

// "Bob.png" taken → "Bob 1.png", "Bob 2.png", …
const freePath = (dir, name) => {
	const [base, ext] = splitExtension(name);
	let candidate = `${dir}/${base}${ext}`;
	for (let n = 1; app.vault.getAbstractFileByPath(candidate); n++) {
		candidate = `${dir}/${base} ${n}${ext}`;
	}
	return candidate;
};

const pickFile = () => new Promise((resolve) => {
	const picker = createEl("input", { attr: { type: "file", accept: "image/*" } });
	picker.style.display = "none";
	document.body.appendChild(picker);
	picker.onchange = () => {
		const chosen = picker.files?.[0] ?? null;
		picker.remove();
		resolve(chosen);
	};
	// A dismissed picker fires no change event in Electron; drop the element on
	// the next focus so it does not linger in the DOM forever.
	window.addEventListener("focus", () => setTimeout(() => picker.remove(), 500), { once: true });
	picker.click();
});

const askFileName = async (suggested) => {
	const qa = app.plugins.plugins.quickadd?.api;
	if (!qa?.inputPrompt) {
		new Notice("QuickAdd API unavailable — keeping the original filename.");
		return suggested;
	}
	// inputPrompt(header, placeholder, value) — cancelling returns null/undefined.
	const answer = await qa.inputPrompt("Image filename", suggested, suggested);
	if (answer == null) return null;
	const trimmed = answer.trim();
	if (!trimmed) return null;
	// Let the user drop the extension without losing the format.
	return extensionOf(trimmed) ? trimmed : trimmed + extensionOf(suggested);
};

const upload = async () => {
	const chosen = await pickFile();
	if (!chosen) return;

	const suggested = (noteBase || splitExtension(chosen.name)[0]) + extensionOf(chosen.name);
	const fileName = await askFileName(suggested);
	if (!fileName) return;

	if (!(await app.vault.adapter.exists(targetDir))) {
		await app.vault.createFolder(targetDir);
	}

	const destination = freePath(targetDir, fileName);
	await app.vault.createBinary(destination, await chosen.arrayBuffer());

	if (field) {
		const note = app.vault.getAbstractFileByPath(notePath);
		if (note) {
			await app.fileManager.processFrontMatter(note, (fm) => {
				fm[field] = `[[${destination}]]`;
			});
		} else {
			new Notice(`Uploaded, but could not find the note to set ${field}.`);
		}
	}

	new Notice(`Image saved to ${destination}`);
};

const host = input?.container ?? dv.container;
const btn = host.createEl("button", { text: label });
btn.style.cssText =
	`border:none;border-radius:${compact ? 5 : 6}px;cursor:pointer;font-weight:600;` +
	`color:#f2e8d0;background:${color};white-space:nowrap;` +
	(compact
		? `width:${input?.width ?? "100%"};padding:.25em .5em;font-size:11px;line-height:1.2;margin:.25em 0;`
		: `width:${input?.width ?? "auto"};padding:.4em .8em;margin:.25em 0;`);
btn.onmouseenter = () => (btn.style.filter = "brightness(1.12)");
btn.onmouseleave = () => (btn.style.filter = "");
btn.onclick = async () => {
	btn.disabled = true;
	try {
		await upload();
	} catch (e) {
		new Notice(`Image upload failed: ${e.message}`);
		console.error("image_upload", e);
	} finally {
		btn.disabled = false;
	}
};
