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
const execDotnet_1 = require("../../util/execDotnet");
const ProjectSelector_1 = require("../../util/ProjectSelector");
const nugetApi_1 = require("../../util/nugetApi");
const PackageQuickPickItem_1 = require("../add/PackageQuickPickItem");
const debounce = require("lodash.debounce");
const difference = require("lodash.difference");
/**
 * Interactive Dialog using QuickPick input to install or upgrade a NuGet package
 */
function addPackage() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = yield ProjectSelector_1.selectProject(ProjectSelector_1.getCsprojects());
        const packageId = yield searchPackage();
        const version = yield pickVersion(packageId, projectPath);
        return vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: `Adding package ${packageId}`,
            cancellable: false
        }, (progress, token) => {
            return execDotnet_1.dotnetAddPackage(projectPath, packageId, version);
        });
    });
}
exports.addPackage = addPackage;
/**
 * Interactive Dialog using QuickPick input to choose a NuGet package ID and version
 */
function pickVersion(packageId, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const version = yield vscode_1.window.showQuickPick(getVersions(packageId, projectPath), { placeHolder: "Choose version" });
        if (!version) {
            throw new Error("No version chosen");
        }
        else {
            return version;
        }
    });
}
/**
 * Gets all but the installed versions for a package in a project
 */
function getVersions(packageId, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        var versions = yield nugetApi_1.searchAutocompleteVersion(packageId);
        const installedPackage = (yield execDotnet_1.dotnetListPackages(projectPath)).filter(el => el.label == packageId);
        if (installedPackage.length == 1) {
            const installedVersion = installedPackage[0].description;
            versions = versions.filter(v => v != installedVersion);
        }
        return versions;
    });
}
/**
 * Interactive dialog using QuickPick and autocomplete to search the NuGet
 * package index for packages and obtain the packageId
 */
function searchPackage() {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        var debouncedLoaderMetadata;
        var debouncedLoaderAutoComplete;
        try {
            return new Promise((resolve, reject) => {
                const disposables = [];
                const input = vscode_1.window.createQuickPick();
                input.ignoreFocusOut = true;
                input.placeholder = "Search Nuget Package";
                disposables.push(input.onDidChangeValue((value) => __awaiter(this, void 0, void 0, function* () {
                    if (debouncedLoaderAutoComplete) {
                        debouncedLoaderAutoComplete.cancel();
                        if (debouncedLoaderMetadata) {
                            debouncedLoaderMetadata.cancel();
                        }
                    }
                    debouncedLoaderAutoComplete = debounce(() => __awaiter(this, void 0, void 0, function* () {
                        if (debouncedLoaderMetadata) {
                            debouncedLoaderMetadata.cancel();
                        }
                        if (!value) {
                            input.items = [];
                            return;
                        }
                        input.busy = true;
                        try {
                            const packageIds = yield nugetApi_1.searchAutocompletePackageId(value);
                            input.items = packageIds.map((packageId) => ({ label: packageId }));
                        }
                        catch (reason) {
                            input.busy = false;
                            reject("Error while fetching the nuget API: " + reason.message);
                        }
                        debouncedLoaderMetadata = debounce(() => __awaiter(this, void 0, void 0, function* () {
                            var packageIds = input.items.map(item => item.label);
                            const detailedItems = yield loadPackageMetadata(packageIds);
                            // only update if the filter has not changed in between
                            if (difference(packageIds, input.items.map(item => item.label)).length === 0) {
                                input.items = detailedItems;
                                input.activeItems = detailedItems.filter(item => item.label == input.activeItems[0].label);
                                input.busy = false;
                            }
                        }), 250);
                        debouncedLoaderMetadata();
                    }), 250);
                    debouncedLoaderAutoComplete();
                })), input.onDidChangeSelection(items => {
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
/**
 * load package metadata as `PackageQuickPickItem`
 */
function loadPackageMetadata(packageIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(packageIds.map((packageId) => __awaiter(this, void 0, void 0, function* () {
            return yield PackageQuickPickItem_1.CreatePackageQuickPickItem(packageId);
        })));
    });
}
//# sourceMappingURL=addPackage.js.map