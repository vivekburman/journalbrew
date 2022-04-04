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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = __importDefault(require("mysql2/promise"));
var http_errors_1 = __importDefault(require("http-errors"));
// interface dbQueryFunc { 
//     insertWithValues(query: string, values:any|any[]): Promise<any>,
//     updateWithValues(query: string, values:any|any[]): Promise<any>, 
//     selectWithValues(query: string, values:any|any[]): Promise<any>,
//     updateJSONValues(query:string, values:any|any[]): Promise<any> 
// };
var QUERY_TYPES;
(function (QUERY_TYPES) {
    QUERY_TYPES["INSERT"] = "INSERT";
    QUERY_TYPES["UPDATE"] = "UPDATE";
    QUERY_TYPES["SELECT"] = "SELECT";
    QUERY_TYPES["UPDATE_JSON"] = "UPDATE_JSON";
    QUERY_TYPES["CTE_SELECT"] = "CTE_SELECT";
    QUERY_TYPES["DELETE"] = "DELETE";
})(QUERY_TYPES || (QUERY_TYPES = {}));
var SQL_DB = /** @class */ (function () {
    function SQL_DB(connect) {
        var _this = this;
        this.CONFIG = {
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        };
        this.TYPES = QUERY_TYPES;
        this.connect = function () {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var _a, err_1;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            _a = this;
                            return [4 /*yield*/, promise_1.default.createConnection(this.CONFIG)];
                        case 1:
                            _a.db = _c.sent();
                            resolve(1);
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _c.sent();
                            (_b = this.db) === null || _b === void 0 ? void 0 : _b.end();
                            reject(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        this.close = function () {
            var _a;
            (_a = _this.db) === null || _a === void 0 ? void 0 : _a.end();
            // console.log('Closing DB');
        };
        this.initalizeTransc = function () {
            var _a;
            return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.beginTransaction();
        };
        this.rollbackTransc = function () {
            var _a;
            return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.rollback();
        };
        this.commitTransc = function () {
            var _a;
            return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.commit();
        };
        this.insertWithValues = function (query, values) {
            var _a;
            if (query.startsWith('Insert') || query.startsWith('INSERT')) {
                return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                    console.error('Insertion failed');
                    _this.logError(query, values, err);
                    throw new http_errors_1.default.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Insert Query');
        };
        this.updateWithValues = function (query, values) {
            var _a;
            if (query.startsWith('Update') || query.startsWith('UPDATE')) {
                return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                    console.log('Updation failed');
                    _this.logError(query, values, err);
                    throw new http_errors_1.default.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Update Query');
        };
        this.cteQueryWithValues = function (query, values) {
            var _a;
            return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                console.error('CTE Query failed');
                _this.logError(query, values, err);
                throw new http_errors_1.default.InternalServerError('SQL Exception');
            });
        };
        this.deleteWithValues = function (query, values) {
            var _a;
            if (query.startsWith('DELETE') || query.startsWith('delete')) {
                return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                    console.error('Deletion failed');
                    _this.logError(query, values, err);
                    throw new http_errors_1.default.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Delete Query');
        };
        this.selectWithValues = function (query, values) {
            var _a;
            if (query.startsWith('SELECT') || query.startsWith('select')) {
                return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                    console.error('Selection failed');
                    _this.logError(query, values, err);
                    throw new http_errors_1.default.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Select Query');
        };
        this.updateJSONValues = function (query, values) {
            var _a;
            return (_a = _this.db) === null || _a === void 0 ? void 0 : _a.query(query, values).catch(function (err) {
                console.error('Updating JSON values failed');
                _this.logError(query, values, err);
                throw new http_errors_1.default.InternalServerError('SQL Exception');
            });
        };
        this.logError = function (query, values, err) {
            console.error("Query: " + query);
            console.error("Values: " + values);
            console.error("Error: " + err);
        };
        this.exec = function (type, query, values) { return __awaiter(_this, void 0, void 0, function () {
            var res, _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(type in QUERY_TYPES)) return [3 /*break*/, 22];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 19, 21, 22]);
                        return [4 /*yield*/, this.connect()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.initalizeTransc()];
                    case 3:
                        _b.sent();
                        _a = type;
                        switch (_a) {
                            case this.TYPES.INSERT: return [3 /*break*/, 4];
                            case this.TYPES.UPDATE: return [3 /*break*/, 6];
                            case this.TYPES.SELECT: return [3 /*break*/, 8];
                            case this.TYPES.UPDATE_JSON: return [3 /*break*/, 10];
                            case this.TYPES.CTE_SELECT: return [3 /*break*/, 12];
                            case this.TYPES.DELETE: return [3 /*break*/, 14];
                        }
                        return [3 /*break*/, 16];
                    case 4: return [4 /*yield*/, this.insertWithValues(query, values)];
                    case 5:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 6: return [4 /*yield*/, this.updateWithValues(query, values)];
                    case 7:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 8: return [4 /*yield*/, this.selectWithValues(query, values)];
                    case 9:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 10: return [4 /*yield*/, this.updateJSONValues(query, values)];
                    case 11:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 12: return [4 /*yield*/, this.cteQueryWithValues(query, values)];
                    case 13:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, this.deleteWithValues(query, values)];
                    case 15:
                        res = _b.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        if (!(res && (type != this.TYPES.SELECT && type != this.TYPES.CTE_SELECT))) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.commitTransc()];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18: return [2 /*return*/, res];
                    case 19:
                        err_2 = _b.sent();
                        return [4 /*yield*/, this.rollbackTransc()];
                    case 20:
                        _b.sent();
                        return [2 /*return*/, Promise.reject(err_2)];
                    case 21:
                        this.close();
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
                }
            });
        }); };
        connect && this.connect();
    }
    return SQL_DB;
}());
exports.default = SQL_DB;
