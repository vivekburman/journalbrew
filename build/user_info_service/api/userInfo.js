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
var express_1 = require("express");
var http_errors_1 = __importDefault(require("http-errors"));
var uuid_1 = require("uuid");
var general_1 = require("../../auth_service/utils/general");
var jwtUtils_1 = require("../../auth_service/utils/jwtUtils");
var database_1 = __importDefault(require("../../database"));
var fields_1 = require("../../database/fields");
var userInfoRouter = express_1.Router();
// 1.  get userinfo
// 2. get user published posts
// 3. get user unpublished posts
// 4. get user bookmarks
var QUERY_SIZE = 50;
userInfoRouter.get('/personal-info/:userId', function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, db, response, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userID = req_.params.userId || null;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default[404];
            case 1:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.SELECT, "SELECT " + fields_1.EMAIL + ", " + fields_1.FIRST_NAME + ", " + fields_1.MIDDLE_NAME + ", " + fields_1.LAST_NAME + ", " + fields_1.PROFILE_PIC_URL + ", " + fields_1.JOINED_AT + " FROM user WHERE " + fields_1.UUID + "=?", [Buffer.from(uuid_1.parse(userID))])];
            case 2:
                response = _c.sent();
                if ((_b = (_a = response === null || response === void 0 ? void 0 : response[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[fields_1.EMAIL]) {
                    res.status(200).json({
                        personalInfo: {
                            email: response[0][0][fields_1.EMAIL],
                            firstName: response[0][0][fields_1.FIRST_NAME],
                            lastName: response[0][0][fields_1.LAST_NAME],
                            middleName: response[0][0][fields_1.MIDDLE_NAME],
                            profilePicUrl: response[0][0][fields_1.PROFILE_PIC_URL],
                            createdAt: response[0][0][fields_1.JOINED_AT],
                        }
                    });
                }
                else {
                    throw new http_errors_1.default[404];
                }
                _c.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                next(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/published-posts', function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, userID, rangeStart, rangeEnd, _rangeEnd, db, response, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                req = req_;
                userID = req.body.userId || null;
                rangeStart = (_a = req.body.filter) === null || _a === void 0 ? void 0 : _a.rangeStart;
                rangeEnd = (_b = req.body.filter) === null || _b === void 0 ? void 0 : _b.rangeEnd;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(!Number.isInteger(rangeStart) || rangeStart < 0)) return [3 /*break*/, 2];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeStart not defined");
            case 2:
                if (!(!Number.isInteger(rangeEnd) || rangeEnd < 0)) return [3 /*break*/, 3];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
            case 3:
                _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.CTE_SELECT, "WITH CTE AS (SELECT " + fields_1.ID + ", \n            ROW_NUMBER() OVER(ORDER BY " + fields_1.CREATED_AT + " DESC) - 1 AS dataIndex, \n            COUNT(*) OVER() AS totalCount, \n            " + fields_1.TITLE + ", " + fields_1.SUMMARY + ", " + fields_1.TYPE + ", " + fields_1.CREATED_AT + " AS createdAt\n            FROM post\n            WHERE post." + fields_1.AUTHOR_ID + " = ?\n            AND " + fields_1.PUBLISH_STATUS + " = 'published' \n            ORDER BY " + fields_1.CREATED_AT + " DESC)\n            SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?", [Buffer.from(uuid_1.parse(userID)), rangeStart, _rangeEnd])];
            case 4:
                response = _c.sent();
                res.status(200).json({
                    postsList: response[0]
                });
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/underreview-posts', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, payload, userID, rangeStart, rangeEnd, _rangeEnd, db, response, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                req = req_;
                payload = req['payload'];
                userID = req.body.userId || null;
                rangeStart = (_a = req.body.filter) === null || _a === void 0 ? void 0 : _a.rangeStart;
                rangeEnd = (_b = req.body.filter) === null || _b === void 0 ? void 0 : _b.rangeEnd;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(payload.id != userID)) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                if (!(!Number.isInteger(rangeStart) || rangeStart < 0)) return [3 /*break*/, 3];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeStart not defined");
            case 3:
                if (!(!Number.isInteger(rangeEnd) || rangeEnd < 0)) return [3 /*break*/, 4];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
            case 4:
                _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.CTE_SELECT, "WITH CTE AS (SELECT " + fields_1.ID + ", \n                ROW_NUMBER() OVER(ORDER BY " + fields_1.CREATED_AT + " DESC) - 1 AS dataIndex, \n                COUNT(*) OVER() AS totalCount, \n                " + fields_1.TITLE + ", " + fields_1.SUMMARY + ", " + fields_1.TYPE + ", " + fields_1.CREATED_AT + " AS createdAt\n                FROM post\n                WHERE post." + fields_1.AUTHOR_ID + " = ?\n                AND " + fields_1.PUBLISH_STATUS + " = 'underReview' \n                ORDER BY " + fields_1.CREATED_AT + " DESC)\n                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?", [Buffer.from(uuid_1.parse(userID)), rangeStart, _rangeEnd])];
            case 5:
                response = _c.sent();
                res.status(200).json({
                    postsList: response[0]
                });
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/bookmarks', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, payload, userID, rangeStart, rangeEnd, _rangeEnd, db, response, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                req = req_;
                payload = req['payload'];
                userID = req.body.userId || null;
                rangeStart = (_a = req.body.filter) === null || _a === void 0 ? void 0 : _a.rangeStart;
                rangeEnd = (_b = req.body.filter) === null || _b === void 0 ? void 0 : _b.rangeEnd;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(payload.id != userID)) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                if (!(!Number.isInteger(rangeStart) || rangeStart < 0)) return [3 /*break*/, 3];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeStart not defined");
            case 3:
                if (!(!Number.isInteger(rangeEnd) || rangeEnd < 0)) return [3 /*break*/, 4];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
            case 4:
                _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.CTE_SELECT, "WITH CTE AS (SELECT bookmark." + fields_1.ID + ", \n                ROW_NUMBER() OVER(ORDER BY bookmark." + fields_1.CREATED_AT + " DESC) - 1 AS dataIndex, \n                COUNT(*) OVER() AS totalCount, \n                " + fields_1.TITLE + ", " + fields_1.SUMMARY + ", " + fields_1.TYPE + ", post." + fields_1.CREATED_AT + " AS createdAt, post." + fields_1.AUTHOR_ID + " AS authorID\n                FROM bookmark INNER JOIN post\n                ON bookmark." + fields_1.BOOKMARK_POST_ID + " = post." + fields_1.ID + "\n                WHERE " + fields_1.USER_UUID + " = ?\n                ORDER BY bookmark." + fields_1.CREATED_AT + " DESC)\n                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?", [Buffer.from(uuid_1.parse(userID)), rangeStart, _rangeEnd])];
            case 5:
                response = _c.sent();
                res.status(200).json({
                    postsList: response[0]
                });
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_3 = _c.sent();
                next(error_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/drafts', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, payload, userID, rangeStart, rangeEnd, _rangeEnd, db, response, result, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                req = req_;
                payload = req['payload'];
                userID = req.body.userId || null;
                rangeStart = (_a = req.body.filter) === null || _a === void 0 ? void 0 : _a.rangeStart;
                rangeEnd = (_b = req.body.filter) === null || _b === void 0 ? void 0 : _b.rangeEnd;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(payload.id != userID)) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                if (!(!Number.isInteger(rangeStart) || rangeStart < 0)) return [3 /*break*/, 3];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeStart not defined");
            case 3:
                if (!(!Number.isInteger(rangeEnd) || rangeEnd < 0)) return [3 /*break*/, 4];
                throw new http_errors_1.default.BadRequest("Filter Object is not in proper format, rangeEnd not defined");
            case 4:
                _rangeEnd = Math.min(rangeStart + QUERY_SIZE, rangeEnd);
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.CTE_SELECT, "WITH CTE AS (SELECT " + fields_1.ID + ", \n                ROW_NUMBER() OVER(ORDER BY " + fields_1.CREATED_AT + " DESC) - 1 AS dataIndex, \n                COUNT(*) OVER() AS totalCount, " + fields_1.FULL_STORY + " AS fullStory, " + fields_1.CREATED_AT + " AS createdAt\n                FROM user_to_post \n                WHERE " + fields_1.AUTHOR_ID + " = ?\n                AND " + fields_1.POST_ID + " IS NULL\n                ORDER BY " + fields_1.CREATED_AT + " DESC)\n                SELECT * FROM CTE WHERE dataIndex >= ? AND dataIndex < ?", [Buffer.from(uuid_1.parse(userID)), rangeStart, _rangeEnd])];
            case 5:
                response = _c.sent();
                result = [];
                if (response[0].length) {
                    result = Array.from(response[0]).map(function (i) {
                        var _a;
                        var blocks = i.fullStory.blocks || [];
                        var title = "", summary = "";
                        for (var i_1 = 0; i_1 < blocks.length; i_1++) {
                            if (blocks[i_1].type === "header" || blocks[i_1].type === "paragraph") {
                                var data = blocks[i_1].data || {};
                                if (data.hasOwnProperty("text")) {
                                    title.length ? (summary = data.text) : (title = data.text);
                                    break;
                                }
                            }
                        }
                        if (!title) {
                            title = "Empty Title !!!!";
                        }
                        if (!summary) {
                            summary = "Empty Summary !!!!";
                        }
                        return _a = {
                                title: title,
                                totalCount: i.totalCount,
                                summary: summary
                            },
                            _a[fields_1.CREATED_AT] = i["createdAt"],
                            _a.dataIndex = i.dataIndex,
                            _a.id = i.id,
                            _a;
                    });
                }
                res.status(200).json({
                    postsList: result
                });
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_4 = _c.sent();
                next(error_4);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.delete('/draft/delete', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, userID, draftID, db, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                req = req_;
                userID = req.body.userId || null;
                draftID = req.body.draftId || null;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(!draftID && !Number.isInteger(draftID))) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.DELETE, "DELETE FROM user_to_post \n                WHERE " + fields_1.ID + "=?\n                AND " + fields_1.AUTHOR_ID + "=?", [draftID, Buffer.from(uuid_1.parse(userID))])];
            case 3:
                response = _a.sent();
                if (response[0] && response[0].affectedRows == 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(500).json({
                        success: false
                    });
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/bookmarked', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, userID, bookmarkID, db, response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                req = req_;
                userID = req.body.userId || null;
                bookmarkID = req.body.bookmarkId || null;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(!bookmarkID && !Number.isInteger(bookmarkID))) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.SELECT, "SELECT " + fields_1.ID + " FROM bookmark WHERE " + fields_1.BOOKMARK_POST_ID + "=? AND " + fields_1.USER_UUID + " = ?", [bookmarkID, Buffer.from(uuid_1.parse(userID))])];
            case 3:
                response = _a.sent();
                if (response[0] && response[0].affectedRows === 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(200).json({
                        success: false
                    });
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.put('/bookmark', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, userID, postID, db, response, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                req = req_;
                userID = req.body.userId || null;
                postID = req.body.postId || null;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(!postID && !Number.isInteger(postID))) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.INSERT, "INSERT INTO `bookmark` SET ?", (_a = {},
                        _a[fields_1.USER_UUID] = Buffer.from(uuid_1.parse(userID)),
                        _a[fields_1.BOOKMARK_POST_ID] = postID,
                        _a[fields_1.CREATED_AT] = general_1.convertTime(),
                        _a))];
            case 3:
                response = _b.sent();
                if (response[0] && response[0].affectedRows == 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(500).json({
                        success: false
                    });
                }
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                next(error_7);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.delete('/delete-bookmark', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, userID, postID, db, response, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                req = req_;
                userID = req.body.userId || null;
                postID = req.body.postId || null;
                if (!(!userID || userID == "")) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("User ID not found in query param");
            case 1:
                if (!(!postID && !Number.isInteger(postID))) return [3 /*break*/, 2];
                throw new http_errors_1.default[404];
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.DELETE, "DELETE FROM bookmark \n                WHERE " + fields_1.BOOKMARK_POST_ID + "=?\n                AND " + fields_1.USER_UUID + "=?", [postID, Buffer.from(uuid_1.parse(userID))])];
            case 3:
                response = _a.sent();
                if (response[0] && response[0].affectedRows == 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(500).json({
                        success: false
                    });
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.post('/following', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, followerID, followingID, db, response, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                req = req_;
                followerID = req.body.followerId || null;
                followingID = req.body.followingId || null;
                if (!(!followerID || !followingID)) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is defined");
            case 1:
                if (!(followerID === followingID)) return [3 /*break*/, 2];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is same");
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.SELECT, "SELECT " + fields_1.ID + " FROM follow WHERE " + fields_1.FOLLOWER_ID + "=? AND " + fields_1.FOLLOWEE_ID + " = ?", [Buffer.from(uuid_1.parse(followerID)), Buffer.from(uuid_1.parse(followingID))])];
            case 3:
                response = _a.sent();
                if (response[0] && response[0].affectedRows === 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(200).json({
                        success: false
                    });
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.put('/follow-request', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, followerID, followingID, db, response, error_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                req = req_;
                followerID = req.body.followerId || null;
                followingID = req.body.followingId || null;
                if (!(!followerID || !followingID)) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is defined");
            case 1:
                if (!(followerID === followingID)) return [3 /*break*/, 2];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is same");
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.INSERT, "INSERT INTO `follow` SET ?", (_a = {},
                        _a[fields_1.FOLLOWEE_ID] = Buffer.from(uuid_1.parse(followingID)),
                        _a[fields_1.FOLLOWER_ID] = Buffer.from(uuid_1.parse(followerID)),
                        _a))];
            case 3:
                response = _b.sent();
                if (response[0] && response[0].affectedRows === 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(500).json({
                        success: false
                    });
                }
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_10 = _b.sent();
                next(error_10);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userInfoRouter.delete('/unfollow-request', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, followerID, followingID, db, response, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                req = req_;
                followerID = req.body.followerId || null;
                followingID = req.body.followingId || null;
                if (!(!followerID || !followingID)) return [3 /*break*/, 1];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is defined");
            case 1:
                if (!(followerID === followingID)) return [3 /*break*/, 2];
                throw new http_errors_1.default.BadRequest("Follower or followee Id is same");
            case 2:
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.DELETE, "DELETE FROM follow WHERE " + fields_1.FOLLOWER_ID + "=? AND " + fields_1.FOLLOWEE_ID + "=?", [
                        Buffer.from(uuid_1.parse(followerID)),
                        Buffer.from(uuid_1.parse(followingID))
                    ])];
            case 3:
                response = _a.sent();
                if (response[0] && response[0].affectedRows === 1) {
                    res.status(200).json({
                        success: true
                    });
                }
                else {
                    res.status(500).json({
                        success: false
                    });
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_11 = _a.sent();
                next(error_11);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = userInfoRouter;
