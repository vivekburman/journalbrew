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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_errors_1 = __importDefault(require("http-errors"));
var database_1 = __importDefault(require("../../database"));
var uuid_1 = require("uuid");
var fields_1 = require("../../database/fields");
var util_1 = require("../../helpers/util");
var searchRouter = express_1.Router();
var QUERY_SIZE = 50;
var TYPES = {
    "DEFAULT": -1,
    "TITLE": 1,
    "TAG": 2,
    "PERSON": 3,
    "LOCATION": 4,
    "TIME": 5,
    "AND": 6
};
/**
 * Search service:
 * 1. Default time frame last 24hrs, Search is always in and, each entity only supports one item example : cannot have array of tags, person. Search is andable, search is time rangeable, search is never text exact match.
 * 2. Search in general → title → Example(Apple Iphone 12)
 * 3. Search in tags → tags → Example(#apple)
 * 4. Search a person → person → Example(@abc)
 * 5. Search in location → location → Example($location)
 * 6. Search in time → time → DD:MM:YYYY-DD:MM:YYYY → first starting time - second ending time
 * 7. AND operation → Apple Iphone 12&#apple&@mnop&DD:MM:YYYY-DD:MM:YYYY
 */
/**
 * Validate Syntax
 * create search query
 * return results in paginated
 */
function isValidTitle(str) {
    return /(?![<>])/g.test(str);
}
function isValidTag(str) {
    return str.startsWith("#") && str.indexOf('#', 1) == -1;
}
// function isValidPerson(str: string): Boolean {
//     return str.startsWith("@") && str.indexOf('@', 1) == -1;
// }
function isValidLocation(str) {
    return str.startsWith("$") && str.indexOf('$', 1) == -1;
}
function isValidTime(str) {
    return /[0-9][0-9]:[0-9][0-9]:[0-9][0-9][0-9][0-9]-[0-9][0-9]:[0-9][0-9]:[0-9][0-9][0-9][0-9]/g.test(str);
}
function isValidAND(str) {
    var arr = str.split("&");
    if (arr.length == 0)
        return false;
    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        if (!isValidTag(val) &&
            !isValidLocation(val) && !isValidTime(val) && !isValidTitle(val))
            return false;
    }
    return true;
}
function isValidSyntax(str, type) {
    if (util_1.isNullOrEmpty(type))
        return false;
    switch (type) {
        case TYPES.DEFAULT:
            return true;
        case TYPES.TITLE:
            return isValidTitle(str);
        case TYPES.TAG:
            return isValidTag(str);
        case TYPES.LOCATION:
            return isValidLocation(str);
        case TYPES.TIME:
            return isValidTime(str);
        case TYPES.AND:
            return isValidAND(str);
    }
    return false;
}
function findType(str, checkAND) {
    if (checkAND === void 0) { checkAND = false; }
    if (isValidTag(str))
        return TYPES.TAG;
    if (isValidLocation(str))
        return TYPES.LOCATION;
    if (isValidTime(str))
        return TYPES.TIME;
    if (isValidTitle(str))
        return TYPES.TITLE;
    if (checkAND && isValidAND(str))
        return TYPES.AND;
    return;
}
function formatTimeForSQL(time) {
    var times = time.split(":");
    return times[2] + "-" + times[1] + "-" + times[0];
}
function getTimeStampQuery(timeStart, timeEnd) {
    var result = {
        query: "",
        values: []
    };
    if (util_1.isNullOrEmpty(timeStart) || util_1.isNullOrEmpty(timeEnd)) {
        return null;
    }
    else {
        result.query = fields_1.CREATED_AT + " BETWEEN ? AND ?";
        result.values.push("" + formatTimeForSQL(timeStart));
        result.values.push("" + formatTimeForSQL(timeEnd));
    }
    return result;
}
function searchByDefault() {
    return {
        query: "",
        values: []
    };
}
function searchByTitle(str) {
    var _a;
    if (util_1.isNullOrEmpty(str)) {
        return null;
    }
    var values = ["%" + ((_a = util_1.escapeQuotes(str)) === null || _a === void 0 ? void 0 : _a.replace(/%/g, '')) + "%"];
    return {
        query: fields_1.TITLE + " LIKE ?",
        values: values
    };
}
function searchByTag(str) {
    if (util_1.isNullOrEmpty(str)) {
        return null;
    }
    var _str = util_1.getHTMLSafeString(str);
    var values = ["\"" + util_1.escapeQuotes(_str.slice(1)).replace(/#/g, '') + "\""];
    return {
        query: "JSON_CONTAINS(" + fields_1.TAGS + ", ?, '$') = 1",
        values: values
    };
}
function searchByLocation(str) {
    if (util_1.isNullOrEmpty(str)) {
        return null;
    }
    var _str = util_1.getHTMLSafeString(str);
    var values = ["%" + util_1.escapeQuotes(_str.slice(1)).replace(/%/g, '').toLowerCase() + "%"];
    return {
        query: fields_1.LOCATION + " LIKE ?",
        values: values
    };
}
function searchByTime(str) {
    var times = str.split("-");
    return getTimeStampQuery(times[0], times[1]);
}
function searchByAND(str) {
    var _a;
    /**
     * 2. split by &, and identify each component
     * 3. return result
     */
    if (util_1.isNullOrEmpty(str))
        return null;
    var arr = str.split('&');
    if (arr.length == 0)
        return null;
    var map = (_a = {},
        _a[TYPES.TAG] = false,
        _a[TYPES.LOCATION] = false,
        _a[TYPES.TIME] = false,
        _a[TYPES.TITLE] = false,
        _a);
    var result = [];
    var values = [];
    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        var type = findType(val);
        if (!type)
            return null;
        if (map[type])
            return null;
        map[type] = true;
        var searchObj = null;
        switch (type) {
            case TYPES.TAG:
                searchObj = searchByTag(str);
                break;
            case TYPES.LOCATION:
                searchObj = searchByLocation(str);
                break;
            case TYPES.TIME:
                searchObj = searchByTime(str);
                break;
            case TYPES.TITLE:
                searchObj = searchByTitle(str);
                break;
        }
        if (!searchObj)
            return null;
        result.push(searchObj.query);
        values.push.apply(values, searchObj.values);
    }
    return {
        values: values,
        query: result.reduce(function (acc, val) { return acc + " AND " + val; })
    };
}
searchRouter.post('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchFilter, type, searchQuery, _rangeEnd, db, query, response, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                searchFilter = req.body.filter;
                if (util_1.isNullOrEmpty(searchFilter)) {
                    throw new http_errors_1.default.BadRequest("Search Filter is Empty");
                }
                if (util_1.isNullOrEmpty(searchFilter.query)) {
                    throw new http_errors_1.default.BadRequest("Search Query is Empty");
                }
                if (!util_1.isNullOrEmpty(searchFilter.type) && !isValidSyntax(searchFilter.query, searchFilter.type)) {
                    throw new http_errors_1.default.BadRequest("Not valid Search Payload");
                }
                if (util_1.isNullOrEmpty(searchFilter.rangeStart) || !Number.isInteger(searchFilter.rangeStart) || searchFilter.rangeStart < 0) {
                    throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeStart not defined");
                }
                if (util_1.isNullOrEmpty(searchFilter.rangeStart) || !Number.isInteger(searchFilter.rangeEnd) || searchFilter.rangeEnd < 0) {
                    throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
                }
                if (util_1.isNullOrEmpty(searchFilter.type)) {
                    type = findType(searchFilter.query, true);
                    if (util_1.isNullOrEmpty(type)) {
                        throw new http_errors_1.default.BadRequest("Cannot identify type");
                    }
                    else {
                        searchFilter.type = type;
                    }
                }
                searchQuery = void 0;
                switch (searchFilter.type) {
                    case TYPES.DEFAULT:
                        searchQuery = searchByDefault();
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    case TYPES.TITLE:
                        searchQuery = searchByTitle(searchFilter.query);
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    case TYPES.TAG:
                        searchQuery = searchByTag(searchFilter.query);
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    case TYPES.LOCATION:
                        searchQuery = searchByLocation(searchFilter.query);
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    case TYPES.TIME:
                        searchQuery = searchByTime(searchFilter.query);
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    case TYPES.AND:
                        searchQuery = searchByAND(searchFilter.query);
                        if (util_1.isNullOrEmpty(searchQuery)) {
                            throw new http_errors_1.default.InternalServerError("Cannot create SQL Query");
                        }
                        break;
                    default:
                        searchQuery = null;
                }
                if (util_1.isNullOrEmpty(searchQuery)) {
                    throw new http_errors_1.default.InternalServerError("Search Query is Empty");
                }
                _rangeEnd = Math.min(searchFilter.rangeStart + QUERY_SIZE, searchFilter.rangeEnd);
                db = new database_1.default();
                query = "WITH CTE AS (SELECT " + fields_1.ID + " as postID, \n            ROW_NUMBER() OVER(ORDER BY " + fields_1.CREATED_AT + " DESC) - 1 AS dataIndex, \n            COUNT(*) OVER() AS totalCount, \n            " + fields_1.TITLE + ", " + fields_1.SUMMARY + ", " + fields_1.TYPE + ", " + fields_1.CREATED_AT + " AS createdAt, post." + fields_1.AUTHOR_ID + " AS authorID\n            FROM post\n            WHERE " + fields_1.PUBLISH_STATUS + " = 'published'\n            " + ((searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.query) ? " AND " + searchQuery.query : '') + "\n            ORDER BY " + fields_1.CREATED_AT + " DESC)\n            SELECT postID, dataIndex, totalCount, createdAt, authorID, \n            " + fields_1.TITLE + ", " + fields_1.SUMMARY + ", " + fields_1.TYPE + ", " + fields_1.PROFILE_PIC_URL + " as profilePicUrl, \n            " + fields_1.FIRST_NAME + " as firstName, " + fields_1.MIDDLE_NAME + " as middleName, " + fields_1.LAST_NAME + " as lastName\n            FROM CTE LEFT JOIN user ON authorID = " + fields_1.UUID + " \n            WHERE dataIndex >= ? AND dataIndex < ?";
                return [4 /*yield*/, db.exec(db.TYPES.CTE_SELECT, query, (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.values) ? __spreadArrays(searchQuery.values, [searchFilter.rangeStart, _rangeEnd]) : [searchFilter.rangeStart, _rangeEnd])];
            case 1:
                response = _b.sent();
                if ((_a = response === null || response === void 0 ? void 0 : response[0]) === null || _a === void 0 ? void 0 : _a.length) {
                    res.status(200).json({
                        postsList: response[0].map(function (i) {
                            i.authorID = uuid_1.stringify(i.authorID);
                            return i;
                        })
                    });
                }
                else {
                    res.status(200).json({
                        postsList: response[0]
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = searchRouter;
