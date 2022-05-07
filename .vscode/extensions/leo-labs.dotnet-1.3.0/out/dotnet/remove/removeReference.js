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
const execDotnet_1 = require("../../util/execDotnet");
const vscode_1 = require("vscode");
/**
 * Interactive Dialog using QuickPick input to remove a project-to-project reference.
 */
function removeReference() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = yield ProjectSelector_1.selectProject(ProjectSelector_1.getCsprojects());
        const referenceProjectPath = yield ProjectSelector_1.selectProject(execDotnet_1.dotnetListReferences(projectPath));
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: `Removing project reference`,
            cancellable: false
        }, (progress, token) => {
            return execDotnet_1.dotnetRemoveReference(projectPath, referenceProjectPath);
        });
    });
}
exports.removeReference = removeReference;
//# sourceMappingURL=removeReference.js.map