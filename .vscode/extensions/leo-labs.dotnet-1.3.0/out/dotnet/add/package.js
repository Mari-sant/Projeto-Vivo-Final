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
const axios_1 = require("axios");
const execDotnet_1 = require("../../util/execDotnet");
const NUGET_AUTOCOMPLETE = "https://api-v2v3search-0.nuget.org/autocomplete";
function addPackage(context) {
    return __awaiter(this, void 0, void 0, function* () {
        return ProjectSelector_1.getCsproj().then((projectPath) => {
            return execDotnet_1.dotnetListPackges(projectPath).then((installedPackages) => {
                return searchPackage(installedPackages).then((packageId) => {
                    return execDotnet_1.dotnetAddPackage(projectPath, packageId);
                });
            });
        }).catch((reason) => {
            vscode_1.window.showWarningMessage(reason);
        });
    });
}
exports.addPackage = addPackage;
function searchPackage(installedPackages) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        try {
            return new Promise((resolve, reject) => {
                const disposables = [];
                const input = vscode_1.window.createQuickPick();
                input.ignoreFocusOut = true;
                input.placeholder = "Search Nuget Package";
                disposables.push(input.onDidChangeValue((value) => {
                    if (!value) {
                        input.items = [];
                        return;
                    }
                    input.busy = true;
                    const query = `q=${value}&take=15&prerelease=true&semVerLevel=2.0.0`;
                    axios_1.default.get(NUGET_AUTOCOMPLETE + "?" + query).then((response) => {
                        var packageIds = response.data.data;
                        packageIds = packageIds.filter(el => !installedPackages.includes(el));
                        input.items = packageIds.map((packageId) => ({ label: packageId }));
                        input.busy = false;
                    }).catch((reason) => {
                        input.busy = false;
                        const message = "Error while fetching the nuget API: ";
                        throw message + reason.message;
                    });
                }), input.onDidChangeSelection(items => {
                    const item = items[0];
                    resolve(item.label);
                    input.hide();
                }), input.onDidHide(() => {
                    reject("No package chosen");
                    input.dispose();
                }));
                input.show();
            });
        }
        finally {
            disposables.forEach(d => d.dispose());
        }
    });
}
//# sourceMappingURL=package.js.map