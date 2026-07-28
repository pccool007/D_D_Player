// Single source of truth for every wizard's type -> icon/iconColor lookup table.
// icon / iconColor are NEVER free choices — wizards read them from here.
//
// Usage (QuickAdd wizard scripts — require by absolute path):
//   const path = require("path");
//   const iconRegistry = require(path.join(
//       app.vault.adapter.basePath,
//       "00 - Config/_obsi/_obsi_scripts/Helpers/_obsi_script_IconRegistry.js"
//   ));
//   const races = iconRegistry("npc");
//
// Templater also auto-registers this as tp.user._obsi_script_IconRegistry("npc").
//
// NOTE: Node's require() cache means edits to this file need an Obsidian reload
// to reach QuickAdd.
//
// Key ORDER matters — it drives the wizard suggester option order. Do not reorder.

const deepFreeze = (obj) => {
    for (const v of Object.values(obj)) {
        if (v && typeof v === "object") deepFreeze(v);
    }
    return Object.freeze(obj);
};

const TABLES = deepFreeze({
    // NPCWizard — keyed off the creature-type `race` (player race goes in subRace)
    npc: {
        "Aberration":   { icon: "LiAlien",         iconColor: "purple" },
        "Beast":        { icon: "LiPawPrint",      iconColor: "orange" },
        "Celestial":    { icon: "LiSun",           iconColor: "yellow" },
        "Construct":    { icon: "LiCpu",           iconColor: "gray"   },
        "Dragon":       { icon: "LiFlame",         iconColor: "red"    },
        "Elemental":    { icon: "LiWind",          iconColor: "cyan"   },
        "Fey":          { icon: "LiSparkles",      iconColor: "pink"   },
        "Fiend":        { icon: "LiSkull",         iconColor: "red"    },
        "Giant":        { icon: "LiMountain",      iconColor: "orange" },
        "Humanoid":     { icon: "LiUser",          iconColor: "green"  },
        "Monstrosity":  { icon: "LiAlertTriangle", iconColor: "yellow" },
        "Ooze":         { icon: "LiDroplet",       iconColor: "cyan"   },
        "Plant":        { icon: "LiLeaf",          iconColor: "green"  },
        "Undead":       { icon: "LiMoon",          iconColor: "purple" },
        // For someone you've met but can't place yet — keeps the field fillable
        // without guessing a creature type.
        "Unknown":      { icon: "LiHelpCircle",    iconColor: "gray"   }
    },

    // FactionWizard — keyed off faction_type
    faction: {
        "Religion":     { icon: "LiChurch",    iconColor: "purple" },
        "Citizenship":  { icon: "LiIdCard",    iconColor: "purple" },
        "Gang":         { icon: "LiSkull",     iconColor: "red"    },
        "Organisation": { icon: "LiBriefcase", iconColor: "purple" },
        "Deity_Group":  { icon: "LiSun",       iconColor: "yellow" }
    },

    // EstablishmentWizard — keyed off establishment_type.
    // Icons carried over verbatim from the inline wizard this replaced.
    establishment: {
        "Commerce & Trade":      { icon: "LiStore"    },
        "Taverns & Inns":        { icon: "LiWine"     },
        "Knowledge & Services":  { icon: "LiBookOpen" },
        "Religious & Spiritual": { icon: "LiChurch"   },
        "Government & Law":      { icon: "LiGavel"    },
        "Travel & Industry":     { icon: "LiPlane"    },
        "Shady & Underworld":    { icon: "LiSkull"    },
        "Other":                 { icon: "LiCircle"   }
    },

    // LocationWizard + SelectLocationTypeAndFolder — ordered ARRAY of categories.
    // `tier` is the depth in the location hierarchy: a child location must sit at a
    // STRICTLY deeper tier than its parent, and the tier picks the containing folder
    // (0 Dimensions, 1 Continents, 2 Regions, 3 Countries, 4 States, 5 Cities).
    // `tier: null` = environment — nests anywhere, gets a folder named after its label.
    // Island sits at State depth (tier 4) so only Cities may nest under it, but keeps
    // its own folder name via the `folder` key.
    location: [
        { label: "Dimension", icon: "LiCircle",              tier: 0 },
        { label: "Continent", icon: "LiSquare",              tier: 1 },
        { label: "Region",    icon: "LiRectangleHorizontal", tier: 2 },
        { label: "Country",   icon: "LiTriangle",            tier: 3 },
        { label: "State",     icon: "LiOctagon",             tier: 4 },
        { label: "City",      icon: "LiBuilding",            tier: 5 },
        { label: "Forest",    icon: "LiTrees",               tier: null },
        { label: "Water",     icon: "LiWaves",               tier: null },
        { label: "Mountain",  icon: "LiMountain",            tier: null },
        { label: "Island",    icon: "LiDiamond",             tier: 4, folder: "Island" },
        { label: "Dungeon",   icon: "LiCastle",              tier: null }
    ],

    // LoreWizard — keyed off lore_type
    lore: {
        "Lore":        { icon: "LiBookOpen",  iconColor: "blue"   },
        "Concept":     { icon: "LiBulb",      iconColor: "yellow" },
        "History":     { icon: "LiCalendar",  iconColor: "orange" },
        "Myth":        { icon: "LiStar",      iconColor: "pink"   },
        "Player_Lore": { icon: "LiBook",      iconColor: "yellow" },
        "Language":    { icon: "LiLanguages", iconColor: "green"  },
        "Music":       { icon: "LiMusic",     iconColor: "purple" }
    },

    // QuestWizard — keyed off quest_status
    quest: {
        "To Do":       { icon: "LiHandCoins",  iconColor: "yellow" },
        "In Progress": { icon: "LiLoader",     iconColor: "blue"   },
        "Completed":   { icon: "LiCircleCheck", iconColor: "green" },
        "Failed":      { icon: "LiCircleX",    iconColor: "red"    },
        "Abandoned":   { icon: "LiArchive",    iconColor: "gray"   }
    },

    // InventoryWizard — keyed off item_type
    inventory: {
        "Weapon":       { icon: "LiSword",     iconColor: "orange" },
        "Armor":        { icon: "LiShield",    iconColor: "gray"   },
        "Potion":       { icon: "LiFlaskConical", iconColor: "green" },
        "Scroll":       { icon: "LiScroll",    iconColor: "yellow" },
        "Wondrous":     { icon: "LiSparkles",  iconColor: "purple" },
        "Tool":         { icon: "LiHammer",    iconColor: "gray"   },
        "Treasure":     { icon: "LiGem",       iconColor: "yellow" },
        "Consumable":   { icon: "LiApple",     iconColor: "green"  },
        "Other":        { icon: "LiPackage",   iconColor: "gray"   }
    },

    // PCWizard — keyed off the 5e class
    pc: {
        "Artificer": { icon: "LiCog",          iconColor: "gray"   },
        "Barbarian": { icon: "LiAxe",          iconColor: "red"    },
        "Bard":      { icon: "LiMusic",        iconColor: "pink"   },
        "Cleric":    { icon: "LiChurch",       iconColor: "yellow" },
        "Druid":     { icon: "LiLeaf",         iconColor: "green"  },
        "Fighter":   { icon: "LiSwords",       iconColor: "orange" },
        "Monk":      { icon: "LiHand",         iconColor: "cyan"   },
        "Paladin":   { icon: "LiShield",       iconColor: "yellow" },
        "Ranger":    { icon: "LiCrosshair",    iconColor: "green"  },
        "Rogue":     { icon: "LiEyeOff",       iconColor: "gray"   },
        "Sorcerer":  { icon: "LiFlame",        iconColor: "red"    },
        "Warlock":   { icon: "LiMoon",         iconColor: "purple" },
        "Wizard":    { icon: "LiBookOpen",     iconColor: "blue"   },
        "Other":     { icon: "LiUser2",        iconColor: "purple" }
    }
});

module.exports = (domain) => {
    const table = TABLES[domain];
    if (!table) {
        throw new Error(
            `IconRegistry: unknown domain "${domain}" (expected: ${Object.keys(TABLES).join(", ")})`
        );
    }
    return table;
};
