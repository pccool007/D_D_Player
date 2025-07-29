module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().parent.path;
    params.variables["folderName"] = path;
};