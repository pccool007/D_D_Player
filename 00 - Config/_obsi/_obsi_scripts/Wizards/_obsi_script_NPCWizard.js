// NPC wizard — prompts name + creature-type race (which drives icon/iconColor),
// gender, the location they were met at, and their factions.
//
// Runs after _obsi_script_SetParamsInCapGetCampaignFolder, which sets
// variables.folderName to "01 - Campaigns/{campaign}". The macro's template step
// writes to {{VALUE:folderName}}/World/NPC, so the race subfolder is carried in
// fileName instead of folderName:
//   {campaign}/World/NPC/{race}/{name}.md
//
// `race` here is the 5e creature type. A player-facing race (Half-Elf, Tiefling…)
// belongs in the template's `subRace` field, which is left blank for the GM to fill.
module.exports = async (params) => {
    const { app, quickAddApi, variables } = params;
    // QuickAdd only honours a THROW: setting variables.cancelled alone lets the
    // macro's template step run on to create a note from empty values.
    const cancel = () => { variables.cancelled = true; throw "cancelled"; };
    const path = require("path");
    const iconRegistry = require(path.join(
        app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
    ));

    const SKIP = "— Skip —";
    // Mirrors the `gender` ValuesList in .obsidian/plugins/metadata-menu/data.json —
    // keep the two in sync so the wizard and the property dropdown offer the same set.
    const GENDERS = ["Male", "Female", "Non-binary", "Unknown", "Other"];

    const name = await quickAddApi.inputPrompt("NPC name?");
    if (!name) cancel();

    const races = iconRegistry("npc");
    const labels = Object.keys(races);
    const race = await quickAddApi.suggester(labels, labels, "Creature type?");
    if (!race) cancel();

    const style = races[race];

    variables.name = name;
    // Frontmatter the promote parser fills in from a session capture — set blank
    // here so QuickAdd never prompts for them on the plain "Add" path.
    variables.subRace = "";
    variables.age = "";
    variables.occupation = "";
    variables.description = "";
    variables.word_description = "";
    variables.fileName = `${race}/${name}`;
    variables.race = race;
    variables.icon = style.icon;
    variables.iconColor = style.iconColor;
    variables.gender = "";
    variables.locations = "";
    variables.first_location = "";
    variables.last_seen = "";
    variables.factions = "";

    const gender = await quickAddApi.suggester(
        [SKIP, ...GENDERS],
        [SKIP, ...GENDERS],
        "Gender?"
    );
    if (gender && gender !== SKIP) variables.gender = gender;

    const campaignRoot = variables.folderName;
    if (!campaignRoot) return;

    const inCampaign = (f) => f.path.startsWith(campaignRoot + "/");
    const typeOf = (f) =>
        String(app.metadataCache.getFileCache(f)?.frontmatter?.type || "").toLowerCase();
    const byName = (a, b) => a.basename.localeCompare(b.basename);

    // Optional "where did we meet them" link — locations and establishments.
    const places = app.vault.getMarkdownFiles()
        .filter(f => inCampaign(f) && ["location", "establishment"].includes(typeOf(f)))
        .sort(byName);

    if (places.length) {
        const picked = await quickAddApi.suggester(
            [SKIP, ...places.map(f => f.basename)],
            [SKIP, ...places],
            "Where were they met?"
        );
        if (picked && picked !== SKIP) {
            // Where they were met is also where they were first met and last seen —
            // the GM moves last_seen on later. `locations` is a YAML list; the other
            // two are scalars.
            variables.locations = `\n  - "[[${picked.basename}]]"`;
            variables.first_location = `"[[${picked.basename}]]"`;
            variables.last_seen = `"[[${picked.basename}]]"`;
        }
    }

    // Factions the NPC belongs to — multi-select, since an NPC can hold several
    // allegiances. Falls back to a single-pick suggester on older QuickAdd builds.
    const factions = app.vault.getMarkdownFiles()
        .filter(f => inCampaign(f) && typeOf(f) === "faction")
        .sort(byName);
    if (!factions.length) return;

    const factionNames = factions.map(f => f.basename);
    const FACTION_QUESTION = "Which factions does this NPC belong to?";
    let chosen = [];

    try {
        const multiSelect = require(path.join(
            app.vault.adapter.basePath,
            "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_MultiSelectPrompt.js"
        ));
        const picked = await multiSelect({
            question: FACTION_QUESTION,
            options: factions.map(f => ({ label: f.basename, sublabel: f.path, value: f })),
            filterPlaceholder: "Filter factions…",
        });
        if (picked === null) return;
        chosen = picked.map(f => f.basename);
    } catch (e) {
        // Never let a broken prompt take the whole wizard down — log it so the
        // fallback is not silent, then use QuickAdd's own pickers.
        console.error("[NPCWizard] faction multi-select failed", e);
        if (typeof quickAddApi.checkboxPrompt === "function") {
            chosen = (await quickAddApi.checkboxPrompt(factionNames)) || [];
        } else {
            const picked = await quickAddApi.suggester(
                [SKIP, ...factionNames],
                [SKIP, ...factionNames],
                FACTION_QUESTION
            );
            if (picked && picked !== SKIP) chosen = [picked];
        }
    }

    if (chosen.length) {
        variables.factions = chosen.map(n => `\n  - "[[${n}]]"`).join("");
    }
};
