/* infobox_img — the header image at the top of a note's [!infobox] callout.
 *
 * Renders the note's image frontmatter field as an embed, or a "No … image found."
 * placeholder when it is empty, followed by a "Set image" button that copies an image
 * off the OS into the campaign's assets folder and writes the link back into `field`.
 *
 * The field name is passed in on purpose and stays per-type in the frontmatter
 * (npc_img / img) — those are the metadata-menu presets and must not be merged
 * into one key.
 *
 * Usage (dataviewjs), inside the callout so every line carries the "> " prefix:
 *   > ```dataviewjs
 *   > await dv.view("00 - Config/_obsi/_obsi_views/infobox_img", { field: "npc_img" });
 *   > ```
 *
 * Options:
 *   field : frontmatter key holding the image wikilink (default "img").
 *   label : noun used in the placeholder, "No {label} image found."
 *           (default: derived from `field` — npc_img → "NPC"; a bare "img"
 *           gives the generic "No image found.").
 *   upload: false to render the image alone, without the "Set image" button.
 *
 * NOTE: this is a Dataview dv.view() file, NOT a Templater user script.
 * It MUST live outside _obsi_scripts — Templater scans that folder
 * recursively and errors on any .js without module.exports.
 */
const LABELS = {
	npc_img: "NPC",
	player_img: "Player",
	location_img: "Location",
	establishment_img: "Establishment",
	img: "",
};

const field = input?.field ?? "img";
const label = input?.label ?? LABELS[field] ?? "";

const img = dv.current()[field];
if (img) {
	dv.paragraph(`!${img}`);
} else {
	dv.paragraph(label ? `No ${label} image found.` : "No image found.");
}

if (input?.upload !== false) {
	await dv.view("00 - Config/_obsi/_obsi_views/image_upload", { field, compact: true });
}
