module.exports = (params) => {
    let path = params.app.workspace.getActiveFile().path;
    const myArray = path.split('/');
    let thisWorld = myArray[1];
    params.variables["folderName"] = 'Worlds/' + thisWorld;    
};