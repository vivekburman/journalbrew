"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var busboy_1 = __importDefault(require("busboy"));
var p_queue_1 = __importDefault(require("p-queue"));
var database_1 = __importDefault(require("../../database"));
var fields_1 = require("../../database/fields");
var util_1 = require("../../helpers/util");
var postRouter = express_1.Router();
var thumbSize = 1024 * 1024 * 2;
var imageSize = 1024 * 1024 * 5;
var ArticleType;
(function (ArticleType) {
    ArticleType["ARTICLE"] = "ARTICLE";
    ArticleType["OPINION"] = "OPINION";
    ArticleType["EOD"] = "EOD";
})(ArticleType || (ArticleType = {}));
var PublishStatus;
(function (PublishStatus) {
    PublishStatus["UNDER_REVIEW"] = "underReview";
    PublishStatus["PUBLISHED"] = "published";
    PublishStatus["DISCARDED"] = "discarded";
    PublishStatus["REMOVED"] = "removed";
})(PublishStatus || (PublishStatus = {}));
function generateSQLStatements(jsonPatch) {
    // 1. get pointer to that object
    // 2. parse the jsonPatch to 3 buckets add, delete, replace
    // 3. fill each bucket of the form array [$'path', 'value']
    // 4. if value is of form object or array replace 'value' -> CAST('value') as JSON 
    var map = [];
    var parsePath = function (path) {
        var result = "$";
        var arr = path.split('/').slice(1);
        // if its not a number then we are going to add into JSON Object, else add into JSON Array
        arr.forEach(function (item) {
            result += Number.isNaN(+item) ? "." + item : "[" + item + "]";
        });
        return result;
    };
    var getUpdateValue = function (val) {
        if (util_1.isNullOrEmpty(val))
            return val;
        if (Array.isArray(val)) {
            return "CAST('[" + val.toString() + "]' AS JSON)";
        }
        if (typeof val === "object") {
            if (!util_1.isNullOrEmpty(val.data.text)) {
                val.data.text = util_1.getSanitizedText(val.data.text);
            }
            return "CAST('" + JSON.stringify(val) + "' AS JSON)";
        }
        if (typeof val === "string" && Number.isNaN(+val)) {
            return "\"" + util_1.getSanitizedText(val) + "\"";
        }
        return val;
    };
    jsonPatch.forEach(function (item, index) {
        var jsonPath = parsePath(item.path);
        var value = getUpdateValue(item.value);
        switch (item.op) {
            case 'add':
                map.push("JSON_SET(" + fields_1.FULL_STORY + ", '" + jsonPath + "', " + value + ")");
                break;
            case 'replace':
                map.push("JSON_REPLACE(" + fields_1.FULL_STORY + ", '" + jsonPath + "', " + value + ")");
                break;
            case 'delete':
                map.push("JSON_REMOVE(" + fields_1.FULL_STORY + ", '" + jsonPath + "')");
                break;
            default:
                return;
        }
    });
    return map;
}
postRouter.post('/create-post', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, payload, db, dbRes, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                req = req_;
                payload = req['payload'];
                db = new database_1.default();
                return [4 /*yield*/, db.exec(db.TYPES.INSERT, "INSERT INTO `user_to_post` SET ?", (_a = {},
                        _a[fields_1.AUTHOR_ID] = Buffer.from(uuid_1.parse(payload['id'])),
                        _a[fields_1.FULL_STORY] = JSON.stringify(req.body.postStory),
                        _a[fields_1.CREATED_AT] = general_1.convertTime(),
                        _a))];
            case 1:
                dbRes = _b.sent();
                if (dbRes) {
                    res.status(200).json({
                        success: true,
                        post_id: dbRes[0]['insertId']
                    });
                }
                else {
                    throw new http_errors_1.default.InternalServerError('unable to create POST');
                }
                return [3 /*break*/, 3];
            case 2:
                e_1 = _b.sent();
                next(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
postRouter.patch('/update-post', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var db, req, payload, jsonPatch, authorID, response, sqlQuery_1, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                db = new database_1.default();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, 6, 7]);
                req = req_;
                payload = req['payload'];
                jsonPatch = req.body;
                authorID = Buffer.from(uuid_1.parse(payload['id']));
                return [4 /*yield*/, db.connect()];
            case 2:
                _b.sent();
                return [4 /*yield*/, db.selectWithValues("SELECT * from user_to_post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=? AND " + fields_1.POST_ID + " IS NULL", [authorID, jsonPatch.postId])];
            case 3:
                response = _b.sent();
                if (((_a = response === null || response === void 0 ? void 0 : response[0]) === null || _a === void 0 ? void 0 : _a.length) != 1) {
                    throw new http_errors_1.default.InternalServerError('Cannot be to Edited');
                }
                sqlQuery_1 = {
                    query: 'UPDATE `user_to_post` SET ',
                    values: []
                };
                generateSQLStatements(jsonPatch.storypatchData).forEach(function (item) {
                    sqlQuery_1.query += fields_1.FULL_STORY + "=?,";
                    sqlQuery_1.values.push({
                        toSqlString: function () {
                            return item;
                        }
                    });
                });
                sqlQuery_1.query = sqlQuery_1.query.slice(0, -1) + " WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=?";
                sqlQuery_1.values.push(authorID, jsonPatch.postId);
                return [4 /*yield*/, db.updateJSONValues(sqlQuery_1.query, sqlQuery_1.values)];
            case 4:
                _b.sent();
                res.status(200).json({
                    success: true
                });
                return [3 /*break*/, 7];
            case 5:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 7];
            case 6:
                db.close();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
postRouter.post('/publish-post', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var busboy_2, req, payload_1, db_1, formPayload_1, fieldParesed_1, workQueue_1, handleErrorBusBoy_1;
    return __generator(this, function (_a) {
        try {
            busboy_2 = new busboy_1.default({
                headers: req_.headers,
            });
            req = req_;
            payload_1 = req['payload'];
            db_1 = new database_1.default();
            formPayload_1 = {};
            fieldParesed_1 = 0;
            workQueue_1 = new p_queue_1.default({ concurrency: 1 });
            handleErrorBusBoy_1 = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    workQueue_1.add(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, fn()];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_2 = _a.sent();
                                    req_.unpipe(busboy_2);
                                    workQueue_1.pause();
                                    next(err_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); };
            busboy_2.on('field', function (fieldname, val) {
                handleErrorBusBoy_1(function () {
                    switch (fieldname) {
                        case 'postId':
                            if (val == null || val == undefined || Number.isNaN(+val)) {
                                next(new http_errors_1.default.BadRequest('postId not found'));
                            }
                            fieldParesed_1++;
                            formPayload_1.postId = val;
                            break;
                        case 'title':
                            if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                                next(new http_errors_1.default.BadRequest('title is null or exceeds 150 char length'));
                            }
                            fieldParesed_1++;
                            formPayload_1.title = val;
                            break;
                        case 'summary':
                            if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                                next(new http_errors_1.default.BadRequest('summary is null or exceeds 150 char length'));
                            }
                            fieldParesed_1++;
                            formPayload_1.summary = val;
                            break;
                        case 'location':
                            if (val == null || val == undefined || val.length == 0 || val.length > 50) {
                                next(new http_errors_1.default.BadRequest('location is null or exceeds 50 char length'));
                            }
                            fieldParesed_1++;
                            formPayload_1.location = val;
                            break;
                        case 'tags':
                            var _val = JSON.parse(val);
                            if (val == null || val == undefined || _val.length == 0 || _val.length > 5
                                || _val.findIndex(function (e) { return typeof e != 'string'; }) != -1) {
                                next(new http_errors_1.default.BadRequest('tags is null or exceeds 5 array length or make sure its all string'));
                            }
                            fieldParesed_1++;
                            formPayload_1.tags = val;
                            break;
                        // case 'type':
                        //     if (val == null || val == undefined || !(val in ArticleType)) {
                        //         next(new createHttpError.InternalServerError('type is null or not supported'));
                        //     }
                        //     fieldParesed++;
                        //     formPayload.type = val;
                        //     break;
                    }
                });
            });
            // busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            //     _mimeType = mimetype;
            //     _encoding = encoding;
            //     handleErrorBusBoy(() => {
            //         if (fieldParesed != 6) {
            //             next(new createHttpError.InternalServerError('fields must be parsed first'));
            //         } else {
            //             const fileTypes = /png/;
            //             const extname = fileTypes.test(filename);
            //             const mimeType = fileTypes.test(mimetype);
            //             if (extname && mimeType) {
            //                 file.on('data', (data) => {
            //                     chunks.push(data);
            //                 });
            //                 file.on('limit', () => {
            //                     chunks.length = 0;
            //                     limit_reach = true;
            //                 });
            //             } else {
            //                 next(new createHttpError.InternalServerError('thumbnail is not proper image only supports .png'));
            //             }
            //         }
            //     })
            // });
            busboy_2.on('finish', function () {
                handleErrorBusBoy_1(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var err_3;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                if (fieldParesed_1 != 5) {
                                    next(new http_errors_1.default.BadRequest('Number of fields parsed does not match the expected count'));
                                }
                                return [4 /*yield*/, db_1.exec(db_1.TYPES.INSERT, "INSERT INTO `post` SET ?", (_a = {},
                                        _a[fields_1.TITLE] = formPayload_1.title,
                                        // [THUMBNAIL]: _res.Location,
                                        _a[fields_1.SUMMARY] = formPayload_1.summary,
                                        _a[fields_1.TAGS] = JSON.stringify(formPayload_1.tags),
                                        _a[fields_1.LOCATION] = formPayload_1.location,
                                        _a[fields_1.TYPE] = ArticleType.ARTICLE,
                                        _a[fields_1.FULL_STORY_ID] = formPayload_1.postId,
                                        _a[fields_1.PUBLISH_STATUS] = PublishStatus.PUBLISHED,
                                        _a[fields_1.CREATED_AT] = general_1.convertTime(),
                                        _a[fields_1.AUTHOR_ID] = Buffer.from(uuid_1.parse(payload_1.id)),
                                        _a))];
                            case 1:
                                _b.sent();
                                res.status(200).json({
                                    success: true
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                err_3 = _b.sent();
                                next(err_3);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
            });
            req_.pipe(busboy_2);
        }
        catch (err) {
            next(err);
        }
        return [2 /*return*/];
    });
}); });
// Anonymous users
postRouter.get('/view-post', function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var db, req, postId, authorID, _authorID, sqlQuery, responsePost, post, _response, userToPost, user, err_4;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                db = new database_1.default();
                _d.label = 1;
            case 1:
                _d.trys.push([1, 9, 10, 11]);
                req = req_;
                postId = req.query.postId;
                authorID = req.query.authorId;
                if (!!postId) return [3 /*break*/, 2];
                next(new http_errors_1.default.BadRequest("Post ID is null"));
                return [3 /*break*/, 8];
            case 2:
                if (!!authorID) return [3 /*break*/, 3];
                next(new http_errors_1.default.BadRequest("User ID is null"));
                return [3 /*break*/, 8];
            case 3:
                _authorID = Buffer.from(uuid_1.parse(authorID));
                return [4 /*yield*/, db.connect()];
            case 4:
                _d.sent();
                sqlQuery = "SELECT " + fields_1.TITLE + ", " + fields_1.TAGS + ", " + fields_1.LOCATION + ", " + fields_1.LIKES + ", " + fields_1.VIEWS + ", " + fields_1.CREATED_AT + " AS createdAt, " + fields_1.FULL_STORY_ID + " FROM post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=? AND " + fields_1.PUBLISH_STATUS + "=?";
                return [4 /*yield*/, db.selectWithValues(sqlQuery, [_authorID, postId, PublishStatus.PUBLISHED])];
            case 5:
                responsePost = _d.sent();
                if (!((_a = responsePost === null || responsePost === void 0 ? void 0 : responsePost[0]) === null || _a === void 0 ? void 0 : _a[0])) return [3 /*break*/, 7];
                post = responsePost[0][0];
                post.tags = util_1.isNullOrEmpty(post.tags) ? [] : JSON.parse(post.tags);
                return [4 /*yield*/, Promise.all([
                        db.selectWithValues("SELECT " + fields_1.FULL_STORY + " AS fullStory, " + fields_1.ID + " AS id FROM user_to_post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=?", [_authorID, post[fields_1.FULL_STORY_ID]]),
                        db.selectWithValues("SELECT " + fields_1.FIRST_NAME + " AS firstName, " + fields_1.MIDDLE_NAME + " AS middleName, " + fields_1.LAST_NAME + " AS lastName, " + fields_1.PROFILE_PIC_URL + " AS profilePicUrl FROM user WHERE " + fields_1.UUID + "=?", [_authorID]),
                    ])];
            case 6:
                _response = _d.sent();
                userToPost = _response[0];
                user = _response[1];
                if (((_b = userToPost === null || userToPost === void 0 ? void 0 : userToPost[0]) === null || _b === void 0 ? void 0 : _b[0]) && ((_c = user === null || user === void 0 ? void 0 : user[0]) === null || _c === void 0 ? void 0 : _c[0])) {
                    delete post[fields_1.FULL_STORY_ID];
                    res.status(200).json({
                        postInfo: userToPost[0][0],
                        authorInfo: __assign(__assign({}, user[0][0]), { authorId: authorID }),
                        metaInfo: post,
                    });
                }
                else {
                    next(new http_errors_1.default.InternalServerError("Article not found"));
                }
                return [3 /*break*/, 8];
            case 7:
                next(new http_errors_1.default.InternalServerError("Article not found"));
                _d.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                err_4 = _d.sent();
                next(err_4);
                return [3 /*break*/, 11];
            case 10:
                db.close();
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); });
// authusers
postRouter.post('/view-post', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var db, req, payload, postId, authorID, loginUserID, _authorID, _loginUserID, isAuthorAndUserSame, sqlQuery, sqlValue, responsePost, post, _response, userToPost, user, bookmark, err_5;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                db = new database_1.default();
                _e.label = 1;
            case 1:
                _e.trys.push([1, 9, 10, 11]);
                req = req_;
                payload = req['payload'];
                postId = req.body.postId;
                authorID = req.body.userId;
                loginUserID = payload['id'];
                if (!!postId) return [3 /*break*/, 2];
                next(new http_errors_1.default.BadRequest("Post ID is null"));
                return [3 /*break*/, 8];
            case 2:
                if (!!authorID) return [3 /*break*/, 3];
                next(new http_errors_1.default.BadRequest("User ID is null"));
                return [3 /*break*/, 8];
            case 3:
                _authorID = Buffer.from(uuid_1.parse(authorID));
                _loginUserID = Buffer.from(uuid_1.parse(loginUserID));
                return [4 /*yield*/, db.connect()];
            case 4:
                _e.sent();
                isAuthorAndUserSame = loginUserID === authorID;
                sqlQuery = "SELECT " + fields_1.TITLE + ", " + fields_1.TAGS + ", " + fields_1.LOCATION + ", " + fields_1.LIKES + ", " + fields_1.VIEWS + ", " + fields_1.CREATED_AT + " AS createdAt, " + fields_1.FULL_STORY_ID + " FROM post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=? " + (isAuthorAndUserSame ? "" : "AND " + fields_1.PUBLISH_STATUS + "=?");
                sqlValue = [_authorID, postId];
                isAuthorAndUserSame && sqlValue.push(PublishStatus.PUBLISHED);
                return [4 /*yield*/, db.selectWithValues(sqlQuery, sqlValue)];
            case 5:
                responsePost = _e.sent();
                if (!((_a = responsePost === null || responsePost === void 0 ? void 0 : responsePost[0]) === null || _a === void 0 ? void 0 : _a[0])) return [3 /*break*/, 7];
                post = responsePost[0][0];
                post.tags = util_1.isNullOrEmpty(post.tags) ? [] : JSON.parse(post.tags);
                return [4 /*yield*/, Promise.all([
                        db.selectWithValues("SELECT " + fields_1.FULL_STORY + " AS fullStory, " + fields_1.ID + " AS id FROM user_to_post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=?", [_authorID, post[fields_1.FULL_STORY_ID]]),
                        db.selectWithValues("SELECT " + fields_1.FIRST_NAME + " AS firstName, " + fields_1.MIDDLE_NAME + " AS middleName, " + fields_1.LAST_NAME + " AS lastName, " + fields_1.PROFILE_PIC_URL + " AS profilePicUrl FROM user WHERE " + fields_1.UUID + "=?", [_authorID]),
                        db.selectWithValues("SELECT " + fields_1.ID + " FROM bookmark WHERE " + fields_1.BOOKMARK_POST_ID + "=? AND " + fields_1.USER_UUID + " = ?", [postId, _loginUserID])
                    ])];
            case 6:
                _response = _e.sent();
                userToPost = _response[0];
                user = _response[1];
                bookmark = _response[2];
                if (((_b = userToPost === null || userToPost === void 0 ? void 0 : userToPost[0]) === null || _b === void 0 ? void 0 : _b[0]) && ((_c = user === null || user === void 0 ? void 0 : user[0]) === null || _c === void 0 ? void 0 : _c[0])) {
                    delete post[fields_1.FULL_STORY_ID];
                    res.status(200).json({
                        postInfo: userToPost[0][0],
                        authorInfo: __assign(__assign({}, user[0][0]), { authorId: authorID }),
                        metaInfo: post,
                        isBookmarked: !!((_d = bookmark === null || bookmark === void 0 ? void 0 : bookmark[0]) === null || _d === void 0 ? void 0 : _d[0])
                    });
                }
                else {
                    next(new http_errors_1.default.InternalServerError("Article not found"));
                }
                return [3 /*break*/, 8];
            case 7:
                next(new http_errors_1.default.InternalServerError("Article not found"));
                _e.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                err_5 = _e.sent();
                next(err_5);
                return [3 /*break*/, 11];
            case 10:
                db.close();
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); });
postRouter.get('/get-post', jwtUtils_1.utils.verifyAccessToken, function (req_, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var req, payload, postId, db, authorID, sqlQuery, response, err_6;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                req = req_;
                payload = req['payload'];
                postId = req.query.postId;
                if (!!postId) return [3 /*break*/, 1];
                next(new http_errors_1.default.InternalServerError("Post ID is null"));
                return [3 /*break*/, 3];
            case 1:
                db = new database_1.default();
                authorID = Buffer.from(uuid_1.parse(payload['id']));
                sqlQuery = "SELECT * FROM user_to_post WHERE " + fields_1.AUTHOR_ID + "=? AND " + fields_1.ID + "=? AND " + fields_1.POST_ID + " IS NULL";
                return [4 /*yield*/, db.exec(db.TYPES.SELECT, sqlQuery, [authorID, postId])];
            case 2:
                response = _c.sent();
                if ((_b = (_a = response === null || response === void 0 ? void 0 : response[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[fields_1.FULL_STORY]) {
                    res.status(200).json({
                        story: response[0][0][fields_1.FULL_STORY]
                    });
                }
                else {
                    next(new http_errors_1.default.InternalServerError("Story not found"));
                }
                _c.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_6 = _c.sent();
                next(err_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/* postRouter.post('/upload-media/image', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const busboy = new Busboy({
            headers: req_.headers,
            limits: {
                files: 1,
                fileSize: imageSize
            }
        });
        const workQueue = new PQueue({concurrency: 1});
        
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });

        const handleErrorBusBoy = async (fn: Function) => {
            workQueue.add(async () => {
                try {
                    await fn();
                } catch(err) {
                    req_.unpipe(busboy);
                    workQueue.pause();
                    next(err);
                }
            });
        };
        let _mimeType='', _encoding='', limit_reach = false, _filename='';
        const chunks: any[] = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            _mimeType = mimetype;
            _encoding = encoding;
            _filename = filename;
            handleErrorBusBoy(() => {
                try {
                    const fileTypes = /png/;
                    const extname = fileTypes.test(filename);
                    const mimeType = fileTypes.test(mimetype);
                    if (extname && mimeType) {
                        file.on('data', (data) => {
                            chunks.push(data);
                        });
                        
                        file.on('limit', () => {
                            chunks.length = 0;
                            limit_reach = true;
                        });
                    } else {
                        throw new createHttpError.InternalServerError('only supported .png format');
                    }
                }catch(err) {
                    next(err);
                }
            });
        });
        busboy.on('finish', () => {
            handleErrorBusBoy(() => {
                if (limit_reach) {
                    next(new createHttpError[413]);
                } else {
                    const params: awsSdk.S3.Types.PutObjectRequest = {
                        Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                        Key: `images/${_filename}_${Date.now()}.png`,
                        Body: Buffer.concat(chunks),
                        ContentType: _mimeType,
                        ContentEncoding: _encoding,
                        ACL: 'public-read'
                    };
                    s3.upload(params, async (err, _res) => {
                        if (err) {
                            next(new createHttpError.InternalServerError('unable to store image to s3'));
                        } else {
                            res.status(200).json({
                                success: true,
                                url: _res.Location,
                                key: _res.Key
                            });
                        }
                    });
                }
            })
        });
        req_.pipe(busboy);
    }catch(err) {
        next(err);
    }
});
postRouter.post('/upload-media/video', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const busboy = new Busboy({
            headers: req_.headers,
            limits: {
                files: 1
            }
        });
        const workQueue = new PQueue({concurrency: 1});
        
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });

        const handleErrorBusBoy = async (fn: Function) => {
            workQueue.add(async () => {
                try {
                    await fn();
                } catch(err) {
                    req_.unpipe(busboy);
                    workQueue.pause();
                    next(err);
                }
            });
        };
        let _mimeType='', _encoding='', limit_reach = false, _filename='';
        const chunks: any[] = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            _mimeType = mimetype;
            _encoding = encoding;
            _filename = filename;
            handleErrorBusBoy(() => {
                try {
                    const fileTypes = /mp4/;
                    const extname = fileTypes.test(filename);
                    const mimeType = fileTypes.test(mimetype);
                    if (extname && mimeType) {
                        file.on('data', (data) => {
                            chunks.push(data);
                        });
                    } else {
                        throw new createHttpError.InternalServerError('only supported .mp4 format');
                    }
                }catch(err) {
                    next(err);
                }
            });
        });
        busboy.on('finish', () => {
            handleErrorBusBoy(() => {
                const params: awsSdk.S3.Types.PutObjectRequest = {
                    Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                    Key: `videos/${_filename}_${Date.now()}.mp4`,
                    Body: Buffer.concat(chunks),
                    ContentType: _mimeType,
                    ContentEncoding: _encoding,
                    ACL: 'public-read'
                };
                s3.upload(params, async (err, _res) => {
                    if (err) {
                        next(new createHttpError.InternalServerError('unable to store video to s3'));
                    } else {
                        res.status(200).json({
                            success: true,
                            url: _res.Location,
                            key: _res.Key
                        });
                    }
                });
            })
        });
        req_.pipe(busboy);
    }catch(err) {
        next(err);
    }
});
postRouter.post('/delete-media/image', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    // 1. connect to aws
    // 2. delete image
    try {
        const req = req_ as RequestWithPayload;
        const db = new SQL_DB();
        const pattern = /^https:\/\/topselfnewsbucket.*.png$/;
        const regex = new RegExp(pattern);

        if (!req.body.mediaURL || !regex.test(req.body.mediaURL) ) {
            throw new createHttpError.InternalServerError('not a image URL');
        }
        if (!req.body.mediaKey || req.body.mediaKey.length < 1 || !req.body.mediaKey.startsWith('images/')) {
            throw new createHttpError.InternalServerError('Image file not found');
        }

        const postId = req.body.postId;
        const index = req.body.mediaKey.indexOf("images/");
        const filename = req.body.mediaKey.slice(index);
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });
        const params: awsSdk.S3.Types.DeleteObjectRequest = {
            Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
            Key: `${filename}`,
        };
        s3.deleteObject(params, async (err, _res) => {
            if (err) {
                // save to DB for future cleanup
                await db.exec(db.TYPES.INSERT, "INSERT INTO `media_clean` SET ?", {
                    [FULL_STORY_ID]: postId,
                    [MEDIA_URL]: req.body.mediaURL
                });
                next(new createHttpError.InternalServerError('unable to delete image from s3'));
            } else {
                res.status(200).json({
                    success: true,
                });
            }
        });
    }catch(err) {
        next(err);
    }
});
postRouter.post('/delete-media/video', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    // 1. connect to aws
    // 2. delete video
    try {
        const req = req_ as RequestWithPayload;
        const db = new SQL_DB();
        const pattern = /^https:\/\/topselfnewsbucket.*.mp4$/;
        const regex = new RegExp(pattern);

        if (!req.body.mediaURL || !regex.test(req.body.mediaURL)) {
            throw new createHttpError.InternalServerError('not a video URL');
        }
        if (!req.body.mediaKey || req.body.mediaKey.length < 1 || !req.body.mediaKey.startsWith('videos/')) {
            throw new createHttpError.InternalServerError('Video file not found');
        }
        const postId = req.body.postId;
        const index = req.body.mediaKey.indexOf("videos/");
        const filename = req.body.mediaKey.slice(index);
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });
        const params: awsSdk.S3.Types.DeleteObjectRequest = {
            Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
            Key: `${filename}`,
        };
        s3.deleteObject(params, async (err, _res) => {
            if (err) {
                // save to DB for future cleanup
                await db.exec(db.TYPES.INSERT, "INSERT INTO `media_clean` SET ?", {
                    [FULL_STORY_ID]: postId,
                    [MEDIA_URL]: req.body.mediaURL
                });
                next(new createHttpError.InternalServerError('unable to delete video from s3'));
            } else {
                res.status(200).json({
                    success: true,
                });
            }
        });
    }catch(err) {
        next(err);
    }
}); */
exports.default = postRouter;
