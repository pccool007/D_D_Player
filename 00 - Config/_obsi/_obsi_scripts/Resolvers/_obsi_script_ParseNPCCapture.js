// Promote-capture step for QuickAdd's "Macro - Promote NPC Capture" macro — a thin wrapper, all the
// work lives in _obsi_script_ParseCapture.js (shared by all four capture types).
const path = require("path");

module.exports = async (params) => {
    const parse = require(path.join(
        params.app.vault.adapter.basePath,
        "00 - Config/_obsi/_obsi_scripts/Resolvers/_obsi_script_ParseCapture.js"
    ));
    return await parse("npc", params);
};
