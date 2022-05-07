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
const ProjectSelector_1 = require("../../util/ProjectSelector");
const execDotnet_1 = require("../../util/execDotnet");
/**
 * Interactive Dialog using QuickPick input to uninstall a NuGet package
 */
function removePackage() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = yield ProjectSelector_1.selectProject(ProjectSelector_1.getCsprojects());
        const packageId = yield selectPackage(projectPath);
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: `Removing package ${packageId}`,
            cancellable: false
        }, (progress, token) => {
            return execDotnet_1.dotnetRemovePackage(projectPath, packageId);
        });
    });
}
exports.removePackage = removePackage;
/**
 * Interactive Dialog using QuickPick input choose a package from a list of installed packages
 */
function selectPackage(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageId = yield vscode_1.window.showQuickPick(execDotnet_1.dotnetListPackages(projectPath), { placeHolder: "Select Package to remove" });
        if (!packageId) {
            throw new Error("No package chosen");
        }
        else {
            return packageId.label;
        }
    });
}
//# sourceMappingURL=removePackage.js.map