module.exports = async function updateDate(params) {
    /*
    This function does the following things:
        1. Gets the current date.
        2. Reads the contents of the current file.
        3. When a line that contains `date::` is found, adds the current date as a note to the end of the line.
    */
    let currDate = moment().format('YYYY-MM-DD');
    const currentFile = params.app.workspace.getActiveFile();
    const fileContents = await params.app.vault.read(currentFile);
    let fileContentsArray = fileContents.split('\n');
    let newFileContentsArray = [];
    for (let line = 0; line < fileContentsArray.length-1; line++) {
        let lineContents = fileContentsArray[line];
        if (lineContents.includes('date::')) {
            newFileContentsArray += lineContents + ', [[' + currDate + ']]\n';
        }
        else {
            newFileContentsArray += lineContents + '\n';
        }
    }
    await params.app.vault.modify(currentFile, newFileContentsArray);
}
