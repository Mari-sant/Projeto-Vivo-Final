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
const nugetApi_1 = require("../../util/nugetApi");
/**
 * QuickPickItem for NuGet package with metadata information
 */
class PackageQuickPickItem {
    constructor(packageId, packageMetadata) {
        this.packageId = packageId;
        this.packageMetadata = packageMetadata;
    }
    get label() {
        return this.packageId;
    }
    ;
    get description() {
        var description = "";
        if (this.packageMetadata.verified) {
            description += '$(verified) ';
        }
        description += " $(versions) ";
        description += this.packageMetadata.latestVersion;
        description += " $(person)";
        description += this.packageMetadata.authors.join(" ");
        description += " $(cloud-download) ";
        description += new Intl.NumberFormat("en-US").format(this.packageMetadata.totalDownloads);
        description += " total downloads";
        return description;
    }
    get detail() {
        return this.packageMetadata.description;
    }
}
exports.PackageQuickPickItem = PackageQuickPickItem;
/**
 * Create a `PackageQuickPickItem` from a NuGet package identifier
 * @param packageId the package identifier
 */
function CreatePackageQuickPickItem(packageId) {
    return __awaiter(this, void 0, void 0, function* () {
        var metadata = yield nugetApi_1.queryPackageMetadata(packageId);
        return new PackageQuickPickItem(packageId, metadata);
    });
}
exports.CreatePackageQuickPickItem = CreatePackageQuickPickItem;
//# sourceMappingURL=PackageQuickPickItem.js.map