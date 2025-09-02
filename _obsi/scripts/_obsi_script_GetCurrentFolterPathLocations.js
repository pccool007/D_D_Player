module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().parent.path;
    let name = params.app.workspace.getActiveFile().basename;
    app.plugins.plugins.dataview.api.pages(`"${path}"`).where(
        page => {
            if(page.name === name){
                const locationType = page.location_type;
                if (locationType.includes("Dimension")) {
                    path += "/Continents";
                } else if (locationType.includes("Continent")) {
                    path += page.regionLess ? "/Countries" : "/Regions";
                } else if (locationType.includes("Regions")) {
                    path += "/Countries";
                } else if (locationType.includes("Country")) {
                    path += page.stateLess ? "/Cities" : "/States";
                } else if (locationType.includes("State")) {
                    path += "/Cities";
                } else if (locationType.includes("City")) {
                    path += "/{{value}}";
                }
            }
        }
    )
    params.variables["folderName"] = path;
};