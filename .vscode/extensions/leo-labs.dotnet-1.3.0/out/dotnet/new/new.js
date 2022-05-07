"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const execDotnet_1 = require("../../util/execDotnet");
const vscode_1 = require("vscode");
const path = require("path");
const ProjectSelector_1 = require("../../util/ProjectSelector");
/**
 * Holds information about templates that can be used with dotnet new
 */
class Template {
    constructor(name, shortName, languages) {
        this.name = name;
        this.shortName = shortName;
        this.isProject = languages.includes("[C#]");
        this.isSolution = languages.includes("Solution");
    }
    get label() {
        return this.name;
    }
    ;
    get description() {
        return this.shortName;
    }
}
exports.Template = Template;
/**
 * Create new dotnet object from template. Projects can be added to opened solutions,
 * projects and solution will be opened in a new workspace
 */
function newFromTemplate() {
    return __awaiter(this, void 0, void 0, function* () {
        const template = yield pickTemplate();
        const outputDirectory = yield pickOutputDirectory();
        const name = yield pickName(path.win32.basename(outputDirectory.path));
        var addToSolution = false;
        var solution = "";
        if (template.isProject && vscode_1.workspace.workspaceFolders) {
            const workspacePath = yield ProjectSelector_1.getWorkspace();
            solution = yield ProjectSelector_1.getSolution(workspacePath, false);
            if (solution) {
                addToSolution = yield pickOption();
            }
        }
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: `Create new ${template.name}`,
            cancellable: false
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            var resultNew = yield execDotnet_1.dotnetNew(template.shortName, name, outputDirectory.fsPath);
            if (addToSolution) {
                const pattern = new vscode_1.RelativePattern(outputDirectory.path, '**/*.csproj');
                const csproj_files = yield vscode_1.workspace.findFiles(pattern, null);
                if (csproj_files.length != 1) {
                    throw new Error("Could not add project to solution.");
                }
                const resultAdd = execDotnet_1.dotnetSlnAdd(solution, csproj_files[0].fsPath);
                return Promise.all([resultNew, resultAdd]).then((values) => {
                    return values[0].concat(...values.slice(1));
                });
            }
            else if (template.isProject || template.isSolution) {
                vscode_1.workspace.updateWorkspaceFolders(0, 0, { uri: outputDirectory });
            }
            return resultNew;
        }));
    });
}
exports.newFromTemplate = newFromTemplate;
/**
 * QuickPick dialog for choosing a name
 */
function pickName(defaultValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield vscode_1.window.showInputBox({ prompt: "Specify the name", value: defaultValue });
        if (!name) {
            throw new Error("No name chosen");
        }
        return name;
    });
}
/**
 * QuickPick dialog for choosing a dotnet template
 */
function pickTemplate() {
    return __awaiter(this, void 0, void 0, function* () {
        const template = yield vscode_1.window.showQuickPick(execDotnet_1.dotnetNewList(), { placeHolder: "Select Template" });
        if (!template) {
            throw new Error("No Template chosen");
        }
        return template;
    });
}
/**
 * QuickPick dialog for choosing an output directory
 */
function pickOutputDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true,
            openLabel: 'Choose Output Directory',
        };
        const outputDirectory = yield vscode_1.window.showOpenDialog(options);
        if (!outputDirectory) {
            throw new Error("No output directory chosen");
        }
        return outputDirectory[0];
    });
}
/**
 * QuickPick dialog to choose if project should be added to already open solution
 */
function pickOption() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode_1.window.showQuickPick(["Yes", "No"], { placeHolder: "Add to solution", });
        if (!result) {
            throw new Error("No option chosen");
        }
        return result == "Yes";
    });
}
//# sourceMappingURL=new.js.map