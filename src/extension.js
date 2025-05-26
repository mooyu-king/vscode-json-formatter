"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let formatterDisposable = vscode.languages.registerDocumentFormattingEditProvider('json', {
        provideDocumentFormattingEdits(document) {
            try {
                const text = document.getText();
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
                // 解析并格式化 JSON
                const formatted = JSON.stringify(JSON.parse(text), null, 2);
                return [vscode.TextEdit.replace(fullRange, formatted)];
            }
            catch (e) {
                vscode.window.showErrorMessage('Invalid JSON');
                return [];
            }
        }
    });
    let openWebsiteDisposable = vscode.commands.registerCommand('json-formatter.openWebsite', () => {
        vscode.env.openExternal(vscode.Uri.parse('https://json-formatter.app/'));
    });
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(globe) JSON Formatter Online";
    statusBarItem.tooltip = "Open json-formatter.app in browser";
    statusBarItem.command = 'json-formatter.openWebsite';
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId === 'json') {
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }));
    const hasShownWelcome = context.globalState.get('json-formatter.hasShownWelcome');
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('Thanks for installing JSON Formatter! Try our online formatter at json-formatter.app', 'Open Website').then(selection => {
            if (selection === 'Open Website') {
                vscode.commands.executeCommand('json-formatter.openWebsite');
            }
        });
        context.globalState.update('json-formatter.hasShownWelcome', true);
    }
    context.subscriptions.push(formatterDisposable);
    context.subscriptions.push(openWebsiteDisposable);
    context.subscriptions.push(statusBarItem);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map