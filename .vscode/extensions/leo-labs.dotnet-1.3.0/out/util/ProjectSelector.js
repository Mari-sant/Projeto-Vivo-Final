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
const vscode_1 = require("vscode");
const execDotnet_1 = require("./execDotnet");
const path = require("path");
/**
 * A QuickPickItem that holds information about a csharp project
 */
class ProjectQuickPickItem {
    constructor(fsPath) {
        this.projectFile = path.win32.basename(fsPath);
        this.fsPath = fsPath;
    }
    get label() {
        return this.projectFile;
    }
    ;
    get description() {
        return this.fsPath;
    }
}
exports.ProjectQuickPickItem = ProjectQuickPickItem;
/**
 * Interactive Dialog using QuickPick input to choose a csharp project from a list of filepaths to projects
 */
function selectProject(projects) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectItems = projects.then((projects) => projects.map((p) => new ProjectQuickPickItem(p)));
        const projectItem = yield selectProjectItem(projectItems);
        return projectItem.fsPath;
    });
}
exports.selectProject = selectProject;
/**
 * Obtain a list of csharp projects. If there is a solution file (.sln) present,
 * return the projects in the solution. Else search for a .csproj file in the workspace
 * directory.
 */
function getCsprojects() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = yield getWorkspace();
        var solutionPath = yield getSolution(workspacePath, false);
        if (solutionPath !== "") {
            const projectPaths = yield execDotnet_1.dotnetSlnList(solutionPath);
            return projectPaths.map((projectPath) => path.dirname(solutionPath) + "/" + projectPath);
        }
        else {
            const pattern = new vscode_1.RelativePattern(workspacePath, '**/*.csproj');
            const csproj_files = yield vscode_1.workspace.findFiles(pattern, null);
            return csproj_files.map((uri) => uri.fsPath);
        }
    });
}
exports.getCsprojects = getCsprojects;
/**
 * Get path to solution file in workspace
 * @param throwIfNone throw an error if none is found or instead an empty string
 */
function getSolution(workspacePath, throwIfNone) {
    return __awaiter(this, void 0, void 0, function* () {
        let pattern = new vscode_1.RelativePattern(workspacePath, '**/*.sln');
        const sln_result = yield vscode_1.workspace.findFiles(pattern, null, 2);
        if (sln_result.length == 1) {
            return sln_result[0].fsPath;
        }
        else if (sln_result.length == 0) {
            if (throwIfNone) {
                throw new Error("No solution file in workspace.");
            }
            return "";
        }
        else {
            throw new Error("More than one solution file in workspace.");
        }
    });
}
exports.getSolution = getSolution;
/**
 * Interactive Dialog using QuickPick input to choose a workspace folder
 * if multiple workspaces are currently open. Throws an error if no workspace is open.
 */
function getWorkspace() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceFolders = vscode_1.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error("No workspace is open.");
        }
        if (workspaceFolders.length == 1) {
            return workspaceFolders[0].uri.fsPath;
        }
        const workspaceFolder = yield vscode_1.window.showQuickPick(workspaceFolders.map((folder) => ({ label: folder.name, details: folder.uri, index: folder.index })), { placeHolder: "Select workspace" });
        if (workspaceFolder) {
            return workspaceFolders[workspaceFolder.index].uri.fsPath;
        }
        throw new Error("No workspace selected");
    });
}
exports.getWorkspace = getWorkspace;
/**
 * Interactive File Open dialog to pick a csproj file from filesystem to add as reference
 */
function getCsprojFromFileSystem() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            canSelectMany: false,
            openLabel: 'Add Reference',
            filters: {
                'csproj files': ['csproj'],
            }
        };
        const fileUri = yield vscode_1.window.showOpenDialog(options);
        if (!(fileUri && fileUri[0])) {
            throw new Error("Please select a project to add as a reference.");
        }
        return fileUri[0].fsPath;
    });
}
exports.getCsprojFromFileSystem = getCsprojFromFileSystem;
/**
 * Interactive Dialog using QuickPick input choose a project from a list of projectquickpickitems
 */
function selectProjectItem(items) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectItem = yield vscode_1.window.showQuickPick(items, { placeHolder: "Select Project" });
        if (!projectItem) {
            throw new Error("No project chosen");
        }
        else {
            return projectItem;
        }
    });
}
//# sourceMappingURL=ProjectSelector.js.map