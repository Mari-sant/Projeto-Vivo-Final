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
const new_1 = require("../dotnet/new/new");
const promisify_child_process_1 = require("promisify-child-process");
/**
 * Runs `dotnet sln <solutionPath> list` to list projects referenced by the solution
 */
function dotnetSlnList(solutionPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield execDotnet(`sln "${solutionPath}" list`);
        return output.slice(2, -1);
    });
}
exports.dotnetSlnList = dotnetSlnList;
/**
 * Runs `dotnet sln <solutionPath> add <projectPath>` to add a project to the solution
 */
function dotnetSlnAdd(solutionPath, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`sln "${solutionPath}" add "${projectPath}"`);
    });
}
exports.dotnetSlnAdd = dotnetSlnAdd;
/**
 * Runs `dotnet sln <solutionPath> remove <projectPath>` to remove a project from the solution
 */
function dotnetSlnRemove(solutionPath, projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`sln "${solutionPath}" remove "${projectPath}"`);
    });
}
exports.dotnetSlnRemove = dotnetSlnRemove;
/**
 * List dotnet packages in csharp project, runs
 * Run `dotnet list <projectPath> package` and parses
 * the output.
 * https://github.com/NuGet/Home/issues/7752 will make this more stable
 */
function dotnetListPackages(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield execDotnet(`list ${projectPath} package`);
        // lines with packages start with '>'
        return output.filter(el => el.includes(">")).map(el => {
            // split by whitespaces into columns
            const columns = el.split(/\s+/);
            return ({ label: columns[2], description: columns.slice(-2)[0] });
        });
    });
}
exports.dotnetListPackages = dotnetListPackages;
/**
 * List dotnet references in csharp project, runs
 * Run `dotnet list <projectPath> reference` and parses
 * the output.
*/
function dotnetListReferences(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield execDotnet(`list ${projectPath} reference`);
        return output.slice(2, -1);
    });
}
exports.dotnetListReferences = dotnetListReferences;
/**
 * Install NuGet package into project.
 *
 * Runs `dotnet add <projectPath> package <packageId> -v <version>`
 */
function dotnetAddPackage(projectPath, packageId, version) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`add "${projectPath}" package ${packageId} -v ${version}`);
    });
}
exports.dotnetAddPackage = dotnetAddPackage;
/**
 * Remove NuGet package from project.
 *
 * Runs `dotnet remove <projectPath> package <packageId>`
 */
function dotnetRemovePackage(projectPath, packageId) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`remove "${projectPath}" package ${packageId}`).then(() => execDotnet(`restore "${projectPath}"`));
    });
}
exports.dotnetRemovePackage = dotnetRemovePackage;
/**
 * Add a project-to-project reference to a project
 *
 * Runs `dotnet add <projectPath> reference <projectPath>`
 */
function dotnetAddReference(projectPath, referenceProjectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`add "${projectPath}" reference "${referenceProjectPath}"`);
    });
}
exports.dotnetAddReference = dotnetAddReference;
/**
 * Remove a project-to-project reference from the project.
 *
 * Runs `dotnet remove <projectPath> reference <projectPath>`
 */
function dotnetRemoveReference(projectPath, referenceProjectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`remove "${projectPath}" reference "${referenceProjectPath}"`);
    });
}
exports.dotnetRemoveReference = dotnetRemoveReference;
/**
 * Retrieve list of templates that can be used with the dotnet new command
 *
 * Runs `dotnet new --list`
 */
function dotnetNewList() {
    return __awaiter(this, void 0, void 0, function* () {
        const output = yield execDotnet("new --list");
        var index = output.findIndex(el => el.startsWith("------------------"));
        return output.slice(index + 1, -1)
            // filter out empty lines from output
            .filter(el => el != "")
            .map((el) => {
            // split by at least 3 whitespaces into columns
            const columns = el.split(/\s\s\s+/);
            return new new_1.Template(columns[0], columns[1], columns[2]);
        });
    });
}
exports.dotnetNewList = dotnetNewList;
/**
 * Creates new item from given template
 *
 * Runs `dotnet new <template> -n <name> -o <output>`
 */
function dotnetNew(template, name, output) {
    return __awaiter(this, void 0, void 0, function* () {
        return execDotnet(`new "${template}" -n "${name}" -o "${output}"`);
    });
}
exports.dotnetNew = dotnetNew;
/**
 * Executes the dotnet command and returns the stdout separated by line
 * @param command subcommand and arguments
 */
function execDotnet(command) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { stdout, stderr } = yield promisify_child_process_1.exec(`dotnet ${command}`);
            if (stdout) {
                return stdout.toString('utf8').split(/\r?\n/);
            }
            else {
                return [];
            }
        }
        catch (e) {
            throw e.message + e.stdout;
        }
    });
}
//# sourceMappingURL=execDotnet.js.map