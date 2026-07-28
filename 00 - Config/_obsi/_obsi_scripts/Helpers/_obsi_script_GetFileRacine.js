function _obsi_script_GetFileRacine (tp) {
    const folders = tp.file.folder(true).split('/')
    const parentFolder = folders.slice(1, 2)
    return parentFolder
}
module.exports = _obsi_script_GetFileRacine;