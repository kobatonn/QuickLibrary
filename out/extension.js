"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function getFilenames(conf, folderPath) {
    const isFile = (file) => {
        const stat = fs.statSync(file);
        return stat.isFile();
    };
    const allFilePath = fs.readdirSync(folderPath);
    let fileNames = allFilePath.filter(name => isFile(`${folderPath}/${name}`));
    const showsHiddenFiles = conf['showHiddenFiles'];
    if (!showsHiddenFiles)
        fileNames = fileNames.filter(name => name.match(/^(?!\.).*$/));
    return fileNames;
}
function pasteLibrary(activeEditor, folderPath, filename) {
    const insertPosition = activeEditor.selection.active;
    const filePath = path.join(folderPath, filename);
    var text = "";
    try {
        text = fs.readFileSync(filePath, "utf-8");
    }
    catch (err) {
        vscode.window.showInformationMessage("File not found.");
        return;
    }
    let insertText = function (editBuilder) {
        editBuilder.insert(insertPosition, text);
    };
    // insertion
    let thenAfterInsert = activeEditor.edit(insertText);
    thenAfterInsert.then((isSucceededEditing) => {
        if (!isSucceededEditing) {
            return; // editing is failed
        }
        // after insertion is complete
    });
}
function activate(context) {
    let disposable = vscode.commands.registerCommand('quicklib.paste', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        const conf = vscode.workspace.getConfiguration('quicklib');
        const folderPath = conf['libraryFolder'];
        let fileNames = getFilenames(conf, folderPath);
        if (!fileNames) {
            return;
        }
        ;
        vscode.window.showQuickPick(fileNames, { placeHolder: 'Filename' }).then(filename => {
            if (filename === undefined) {
                throw new Error('cancelled');
            }
            // handle valid filename
            pasteLibrary(activeEditor, folderPath, filename);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map