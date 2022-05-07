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
const ProjectSelector_1 = require("../../util/ProjectSelector");
const vscode_1 = require("vscode");
const execDotnet_1 = require("../../util/execDotnet");
/**
 * Interactive Dialog using QuickPick input to add a project to a solution
 */
function addProject() {
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = yield ProjectSelector_1.getWorkspace();
        const solutionPath = yield ProjectSelector_1.getSolution(workspacePath, true);
        const referenceProjectPath = yield ProjectSelector_1.getCsprojFromFileSystem();
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: `Adding project to solution`,
            cancellable: false
        }, (progress, token) => {
            return execDotnet_1.dotnetSlnAdd(solutionPath, referenceProjectPath);
        });
    });
}
exports.addProject = addProject;
//# sourceMappingURL=addProject.js.map