function getFileRacineForProperties (tp) {
    console.log("getFileRacineForProperties.js launched");
    const folders = tp.file.folder(true).split('/')
    const parentFolder = folders.slice(1, 2)
    console.log("parentFolder: " + parentFolder);
    return "[[" + parentFolder + "]]"
}
module.exports = getFileRacineForProperties;
