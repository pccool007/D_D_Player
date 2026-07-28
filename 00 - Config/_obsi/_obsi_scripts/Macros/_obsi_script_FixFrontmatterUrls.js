// Repair URLs broken by a wrapped paste in any note's frontmatter.
//
// A Macro (not a Wizard): it rewrites existing notes and runs no template step.
//
// Pasting a URL that was line-wrapped at the source leaves whitespace inside it
// ("https: //host/path"), which stops Obsidian from linkifying it and shows the
// raw "[Label](https: //…)" text in Dataview tables. A URL can never contain
// whitespace, so every scrub below is lossless.
//
// Touches string values only, in these frontmatter keys:
//   * any key ending in `_url` / `_urls` (dndbeyond_url, …)
//   * `urls`, `url`, `link`, `links`, `source`
// and only when the value is a bare http(s) URL or a "[Label](http…)" link.
module.exports = async (params) => {
    const { app } = params;

    const notify = (msg) => {
        try { new Notice(msg); } catch (e) { console.log("[FixFrontmatterUrls]", msg); }
    };

    const URL_KEY = /(^|_)urls?$|^links?$|^source$/i;
    const stripSpaces = (href) => href.replace(/\s+/g, "");

    const repair = (value) => {
        if (typeof value !== "string") return value;
        let out = value.replace(/\]\(\s*(https?:[^)]+)\)/gi, (_, href) => `](${stripSpaces(href)})`);
        if (/^\s*https?:\s*\/\//i.test(out)) out = stripSpaces(out);
        return out;
    };

    const fixed = [];

    for (const file of app.vault.getMarkdownFiles()) {
        const cache = app.metadataCache.getFileCache(file)?.frontmatter;
        if (!cache) continue;

        const keys = Object.keys(cache).filter(k => URL_KEY.test(k));
        if (!keys.length) continue;

        // Cheap pre-check so we only rewrite files that actually need it.
        const needsWork = keys.some(k => {
            const v = cache[k];
            const items = Array.isArray(v) ? v : [v];
            return items.some(i => typeof i === "string" && repair(i) !== i);
        });
        if (!needsWork) continue;

        let count = 0;
        await app.fileManager.processFrontMatter(file, (fm) => {
            for (const k of keys) {
                const v = fm[k];
                if (Array.isArray(v)) {
                    fm[k] = v.map(i => {
                        const r = repair(i);
                        if (r !== i) count++;
                        return r;
                    });
                } else {
                    const r = repair(v);
                    if (r !== v) { fm[k] = r; count++; }
                }
            }
        });

        if (count) fixed.push(`${file.basename} (${count})`);
    }

    notify(fixed.length
        ? `Fixed ${fixed.length} note(s): ${fixed.join(", ")}`
        : "No broken frontmatter URLs found.");
};
