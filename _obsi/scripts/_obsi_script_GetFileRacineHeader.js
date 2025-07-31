function _obsi_script_GetFileRacineHeader (tp) {
    const folders = tp.file.folder(true).split('/')
    const parentFolder = folders.slice(1, 2)
    return "[[" + parentFolder + "]]"
}
module.exports = _obsi_script_GetFileRacineHeader;

// header set with logins