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
function pasteCode(folderPath, filename) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }
    const insertPosition = activeEditor.selection.active;
    const filePath = path.join(folderPath, filename);
    var text = "";
    try {
        text = fs.readFileSync(filePath, "utf-8");
    }
    catch (err) {
        vscode.window.showErrorMessage("File not found.");
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
function saveCode(filePath, text) {
    if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage('Failed: same filename already exists.');
        return;
    }
    try {
        fs.writeFileSync(filePath, text);
    }
    catch (err) {
        vscode.window.showErrorMessage("Failed: saving error.");
        return;
    }
    vscode.window.showInformationMessage('Completed saving code.');
}
function activate(context) {
    let pasteCommand = vscode.commands.registerCommand('quicklib.paste', () => {
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
            pasteCode(folderPath, filename);
        });
    });
    let saveCommand = vscode.commands.registerCommand('quicklib.save', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        const selection = activeEditor.selection;
        if (activeEditor.selection.isEmpty) {
            return;
        }
        const text = activeEditor.document.getText(selection);
        const conf = vscode.workspace.getConfiguration('quicklib');
        const folderPath = conf['libraryFolder'];
        vscode.window.showInputBox({ placeHolder: 'Filename' }).then(filename => {
            if (filename == undefined)
                return;
            const filePath = path.join(folderPath, filename);
            saveCode(filePath, text);
        });
    });
    context.subscriptions.push(pasteCommand);
    context.subscriptions.push(saveCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map