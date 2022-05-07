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
function removePackage(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return ProjectSelector_1.getCsproj().then((projectPath) => {
            return selectPackage(projectPath).then((packageId) => {
                return execDotnet_1.dotnetRemovePackage(projectPath, packageId);
            });
        }).catch((reason) => {
            vscode_1.window.showWarningMessage(reason);
        });
    });
}
exports.removePackage = removePackage;
function selectPackage(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            vscode_1.window.showQuickPick(execDotnet_1.dotnetListPackges(projectPath), { placeHolder: "Select Package to remove" }).then((packageId) => {
                if (!packageId) {
                    reject("No package chosen");
                }
                resolve(packageId);
            });
        });
    });
}
//# sourceMappingURL=package.js.map