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
const vscode = require("vscode");
const addPackage_1 = require("./dotnet/add/addPackage");
const removePackage_1 = require("./dotnet/remove/removePackage");
const addReference_1 = require("./dotnet/add/addReference");
const removeReference_1 = require("./dotnet/remove/removeReference");
const addProject_1 = require("./dotnet/sln/addProject");
const removeProject_1 = require("./dotnet/sln/removeProject");
const new_1 = require("./dotnet/new/new");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.add.package', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(addPackage_1.addPackage); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.remove.package', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(removePackage_1.removePackage); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.add.reference', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(addReference_1.addReference); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.remove.reference', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(removeReference_1.removeReference); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.sln.add', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(addProject_1.addProject); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.sln.remove', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(removeProject_1.removeProject); })));
    context.subscriptions.push(vscode.commands.registerCommand('extension.dotnet.new', () => __awaiter(this, void 0, void 0, function* () { return runAndshowErrorAsMessage(new_1.newFromTemplate); })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function runAndshowErrorAsMessage(func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield func();
        }
        catch (error) {
            var message;
            if (error instanceof Error) {
                message = error.message;
            }
            else {
                message = error;
            }
            vscode.window.showWarningMessage(message);
        }
        ;
    });
}
//# sourceMappingURL=extension.js.map