import * as vscode from 'vscode';
import { ofetch } from "ofetch";
import * as fs from 'fs-extra';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.downloadImage', async () => {
        const imageUrl = await vscode.window.showInputBox({ prompt: 'Enter image URL' });
        if (imageUrl) {
            try {
                const response = await ofetch(imageUrl, { responseType: 'stream' });
                const ext = path.extname(imageUrl);
                const fileName = `image_${Date.now()}${ext}`;
                const savePath = path.join(vscode.workspace.rootPath || '', 'img', fileName);
                console.log(response)
                // response.data.pipe(fs.createWriteStream(savePath));
                vscode.window.showInformationMessage(`Image downloaded to img/${fileName}`);
            } catch (error: any) { // 'error' değişkeninin türünü belirtiyoruz
                vscode.window.showErrorMessage(`Error downloading image: ${error.message}`);
            }
        }
    });

    context.subscriptions.push(disposable);
}
