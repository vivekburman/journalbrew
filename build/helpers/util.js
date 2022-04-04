"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN = exports.PublishStatus = exports.escapeQuotes = exports.isNullOrEmpty = exports.getHTMLSafeString = void 0;
var FIRST_NAME = 'first_name', MIDDLE_NAME = 'middle_name', LAST_NAME = 'last_name';
var PublishStatus;
(function (PublishStatus) {
    PublishStatus["UNDER_REVIEW"] = "underReview";
    PublishStatus["PUBLISHED"] = "published";
    PublishStatus["DISCARDED"] = "discarded";
    PublishStatus["REMOVED"] = "removed";
})(PublishStatus || (PublishStatus = {}));
exports.PublishStatus = PublishStatus;
var REFRESH_TOKEN = "tsn_refresh_token";
exports.REFRESH_TOKEN = REFRESH_TOKEN;
var getHTMLSafeString = function (str) {
    return str
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
};
exports.getHTMLSafeString = getHTMLSafeString;
var isNullOrEmpty = function (obj) {
    if (obj === null || obj === undefined) {
        return true;
    }
    if (typeof obj === 'string' && obj === "") {
        return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {
        return true;
    }
    if (typeof obj === obj && Object.keys(obj).length == 0) {
        return true;
    }
    return false;
};
exports.isNullOrEmpty = isNullOrEmpty;
var escapeQuotes = function (str) {
    return str ? str.replace(/"|`|'/g, '') : '';
};
exports.escapeQuotes = escapeQuotes;
