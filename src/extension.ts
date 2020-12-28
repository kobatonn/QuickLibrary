import * as vscode from 'vscode';
import * as fs from "fs"
import * as path from 'path';

function getFilenames(conf : vscode.WorkspaceConfiguration, folderPath : string) {
	const isFile = (file : string) => {
		const stat = fs.statSync(file);
		return stat.isFile();
	}
	
	const allFilePath = fs.readdirSync(folderPath);
	let fileNames = allFilePath.filter(name => isFile(`${folderPath}/${name}`));
	
	const showsHiddenFiles = conf['showHiddenFiles'];
	if (!showsHiddenFiles) fileNames = fileNames.filter(name => name.match(/^(?!\.).*$/));
	return fileNames;
}

function pasteCode(folderPath : string, filename: string) {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) { return; }
	const insertPosition = activeEditor.selection.active;
	const filePath = path.join(folderPath, filename);
	
	var text = "";
	try {
		text = fs.readFileSync(filePath, "utf-8");
	} catch(err) {
		vscode.window.showInformationMessage("File not found.");
		return;
	}
	
	let insertText = function(editBuilder: vscode.TextEditorEdit): void{
		editBuilder.insert(insertPosition, text);
	}

	// insertion
	let thenAfterInsert = activeEditor.edit(insertText);
	thenAfterInsert.then(
		(isSucceededEditing) => {
			if(!isSucceededEditing){
				return; // editing is failed
			}
			// after insertion is complete
		}
	)
}

export function activate(context: vscode.ExtensionContext) {

	let pasteCommand = vscode.commands.registerCommand('quicklib.paste', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) { return; }
	
		const conf = vscode.workspace.getConfiguration('quicklib');
		const folderPath = conf['libraryFolder'];
		let fileNames = getFilenames(conf, folderPath);
		if (!fileNames) { return; };
	
		vscode.window.showQuickPick(fileNames, {placeHolder: 'Filename'}).then(filename => {
			if (filename === undefined) {  throw new Error('cancelled');	}

			pasteCode(folderPath, filename);
		});

	});

	context.subscriptions.push(pasteCommand);
}

export function deactivate() {}
