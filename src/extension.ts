import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 添加输出通道
    const outputChannel = vscode.window.createOutputChannel('JSON Formatter');
    outputChannel.show();
    outputChannel.appendLine('JSON Formatter is activating...');

    try {
        // 注册格式化提供程序
        const formatter = vscode.languages.registerDocumentFormattingEditProvider('json', {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                outputChannel.appendLine('Formatting document...');
                try {
                    const text = document.getText();
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(text.length)
                    );
                    
                    const formatted = JSON.stringify(JSON.parse(text), null, 2);
                    outputChannel.appendLine('Document formatted successfully');
                    return [vscode.TextEdit.replace(fullRange, formatted)];
                } catch (e) {
                    outputChannel.appendLine(`Error formatting document: ${e}`);
                    vscode.window.showErrorMessage('Invalid JSON');
                    return [];
                }
            }
        });

        // 注册命令
        const openWebsite = vscode.commands.registerCommand('json-formatter.openWebsite', () => {
            outputChannel.appendLine('Opening website...');
            vscode.env.openExternal(vscode.Uri.parse('https://json-formatter.app/'));
        });

        // 创建状态栏项
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = "$(globe) JSON Formatter Online";
        statusBarItem.tooltip = "Open json-formatter.app in browser";
        statusBarItem.command = 'json-formatter.openWebsite';

        // 文档变化监听器
        context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(document => {
                outputChannel.appendLine(`Document opened: ${document.languageId}`);
                if (document.languageId === 'json') {
                    outputChannel.appendLine('JSON document detected, showing status bar item');
                    statusBarItem.show();
                } else {
                    statusBarItem.hide();
                }
            })
        );

        // 检查当前活动编辑器
        if (vscode.window.activeTextEditor) {
            outputChannel.appendLine(`Active editor language: ${vscode.window.activeTextEditor.document.languageId}`);
            if (vscode.window.activeTextEditor.document.languageId === 'json') {
                statusBarItem.show();
            }
        }

        context.subscriptions.push(formatter);
        context.subscriptions.push(openWebsite);
        context.subscriptions.push(statusBarItem);

        outputChannel.appendLine('JSON Formatter activated successfully');
        vscode.window.showInformationMessage('JSON Formatter is now active');

    } catch (error) {
        outputChannel.appendLine(`Error during activation: ${error}`);
        console.error(error);
    }
}

export function deactivate() {}
