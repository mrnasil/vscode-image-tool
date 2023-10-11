import * as vscode from "vscode";
import * as sharp from "sharp";
import { Uri } from "vscode";
import { getApi, FileDownloader } from "@microsoft/vscode-file-downloader-api";



// List of supported file types
const supportedTypes = ["PNG", "JPG", "JPEG", "GIF", "SVG"];



export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.downloadImage",
    async () => {
      const imageUrl = await vscode.window.showInputBox({
        prompt: "Enter image URL",
      });
      if (imageUrl) {
        const filename =
          new Date().getTime() + imageUrl.substring(imageUrl.lastIndexOf("."));
        const fileDownloader: FileDownloader = await getApi();
        try {
          const file: Uri | undefined = await fileDownloader.downloadFile(
            Uri.parse(imageUrl),
            filename,
            context
          );

          if (file) {
            vscode.workspace.workspaceFolders?.forEach(async (folder) => {
              vscode.commands.executeCommand("vscode.openFolder", folder.uri);

              vscode.window.showInformationMessage("PATH:"+ file.fsPath);

              // Add your file type conversion logic here
              if (isSupportedFileType(file.fsPath)) {
                vscode.workspace.fs.copy(
                  file,
                  folder.uri.with({ path: folder.uri.path + "/" + filename }),
                  { overwrite: true }
                );

                vscode.window.showInformationMessage("Converting file...");
                await convertFile(file.fsPath, folder.uri.fsPath, filename);
              }

              // Refresh explorer
              if (folder.uri.fsPath === file.fsPath) {
                vscode.commands.executeCommand(
                  "workbench.files.action.refreshFilesExplorer"
                );
              }
            });

            vscode.window.showInformationMessage(
              `Image downloaded to ${file.fsPath}`
            );
          } else {
            vscode.window.showErrorMessage("Error downloading image");
          }
        } catch (error: any) {
          vscode.window.showErrorMessage(
            `Error downloading image: ${error.message}`
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function isSupportedFileType(filePath: string): boolean {
  // Check if the file type is in the list of supported types
  const fileExtension = filePath
    .substring(filePath.lastIndexOf(".") + 1)
    .toUpperCase();
  return supportedTypes.includes(fileExtension);
}

async function convertFile(
  filePath: string,
  targetPath: string,
  fileName: string
): Promise<void> {
  // Implement your file conversion logic here
  // You might need to use an external library or tool for conversion
  // For example, you can use ImageMagick or other libraries for image conversion
  // Make sure to handle any errors during the conversion process

  vscode.window.showInformationMessage(`Deneme`);


  const data = await sharp(filePath + fileName)
  .toFormat('png')
  .toBuffer();

  vscode.workspace.fs.copy(
    Uri.parse(data.toString()),
    Uri.parse(targetPath + "/" + fileName),
  );

  vscode.window.showInformationMessage(`Convert işlemi yapıldı ${filePath}`);
}
