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
const axios_1 = require("axios");
const NUGET_AUTOCOMPLETE = "https://azuresearch-usnc.nuget.org/autocomplete?";
const NUGET_AUTOCOMPLETE_PARAM = "&take=15&prerelease=true&semVerLevel=2.0.0";
const NUGET_SEARCH = "https://azuresearch-usnc.nuget.org/query?q=";
const NUGET_SEARCH_PARAM = "&take=1&prerelease=false&semVerLevel=2.0.0";
/**
 * Autocomplete Search for package identifier
 * https://docs.microsoft.com/de-de/nuget/api/search-autocomplete-service-resource
 * Includes prerelease packages
 * @param q search term for package identifier
 */
function searchAutocompletePackageId(q) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `q=${q}`;
        return searchAutocomplete(query);
    });
}
exports.searchAutocompletePackageId = searchAutocompletePackageId;
/**
 * Autocomplete search for versions for a package. This API is faster than to query
 * the package information via the `SearchQueryService`
 * @param packageId The package identifier
 */
function searchAutocompleteVersion(packageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `id=${packageId}`;
        return searchAutocomplete(query).then((versions) => versions.reverse());
    });
}
exports.searchAutocompleteVersion = searchAutocompleteVersion;
/**
 * Connects to the nuget`SearchAutocompleteService` and returns the result of
 * @param query the query
 */
function searchAutocomplete(query) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield axios_1.default.get(NUGET_AUTOCOMPLETE + query + NUGET_AUTOCOMPLETE_PARAM);
        return response.data.data;
    });
}
/**
 * Metadata of a NuGet package
 */
class PackageMetadata {
    constructor(verified = false, latestVersion = "", description = "", authors = [], totalDownloads = 0) {
        this.verified = verified;
        this.latestVersion = latestVersion;
        this.description = description;
        this.authors = authors;
        this.totalDownloads = totalDownloads;
    }
}
exports.PackageMetadata = PackageMetadata;
/**
 * load package metadata from NuGet api for package identifier
 * @param packageId the package identifier
 */
function queryPackageMetadata(packageId) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield axios_1.default.get(NUGET_SEARCH + "PackageId:" + packageId + NUGET_SEARCH_PARAM);
        if (response.data.data.length == 0) {
            return new PackageMetadata();
        }
        ;
        var data = response.data.data[0];
        return new PackageMetadata(data.verified, data.versions.slice(-1)[0].version, data.description, data.authors, data.totalDownloads);
    });
}
exports.queryPackageMetadata = queryPackageMetadata;
//# sourceMappingURL=nugetApi.js.map