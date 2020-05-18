"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
function pasteLibrary(activeEditor, fileName) {
    if (!activeEditor) {
        return;
    }
    const insertPosition = activeEditor.selection.active;
    const conf = vscode.workspace.getConfiguration('quicklib');
    const folderPath = conf['libraryFolder'];
    const path = require('path');
    const filePath = path.join(folderPath, fileName);
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
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }
    let disposable = vscode.commands.registerCommand('quicklib.paste', () => {
        vscode.window.showInputBox({ prompt: 'Enter the filename to paste.', placeHolder: 'Filename' }).then(value => {
            if (value === undefined) {
                throw new Error('cancelled');
            }
            // handle valid values
            pasteLibrary(activeEditor, value);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map