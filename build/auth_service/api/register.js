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
var passport_1 = __importDefault(require("passport"));
var jwtUtils_1 = require("../utils/jwtUtils");
var encrypt_decrypt_1 = require("../utils/encrypt_decrypt");
var http_errors_1 = __importDefault(require("http-errors"));
var redis_server_1 = require("../server/redis.server");
var uuid_1 = require("uuid");
var general_1 = require("../utils/general");
var buffer_1 = require("buffer");
var database_1 = __importDefault(require("../../database"));
var fields_1 = require("../../database/fields");
var util_1 = require("../../helpers/util");
var getName = function (name) {
    var name_ = name === null || name === void 0 ? void 0 : name.split(' ');
    return { firstName: name_[0], middleName: name_[2] ? name_[1] : fields_1.UNDEF, lastName: name_[2] || name_[1] || fields_1.UNDEF };
};
var registerRouter = express_1.Router();
// auth with google
registerRouter.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    accessType: 'offline',
    prompt: 'consent'
}));
registerRouter.get('/protected', jwtUtils_1.utils.verifyAccessToken, function (req, res) {
    res.send('YOU ARE AUTHORIZED');
});
// auth google redirect
registerRouter.get('/google/redirect', passport_1.default.authenticate('google', { session: false }), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var db, profile, _a, firstName, middleName, lastName, profilePicUrl, email, data_1, strategyId, uuid, time, tokenObj, userID, accessTokenJWT, err_1;
    var _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                db = new database_1.default();
                _e.label = 1;
            case 1:
                _e.trys.push([1, 14, 15, 16]);
                profile = req.user.profile;
                if (!(!profile.emails || !profile.emails[0] || !profile.emails[0].value)) return [3 /*break*/, 2];
                throw new http_errors_1.default.BadRequest("Email not Found");
            case 2:
                _a = getName(profile.displayName), firstName = _a.firstName, middleName = _a.middleName, lastName = _a.lastName;
                profilePicUrl = ((_c = profile.photos[0]) === null || _c === void 0 ? void 0 : _c.value) || null;
                email = (_d = profile.emails[0]) === null || _d === void 0 ? void 0 : _d.value;
                return [4 /*yield*/, db.connect()];
            case 3:
                _e.sent();
                return [4 /*yield*/, db.selectWithValues("SELECT " + fields_1.UUID + ", " + fields_1.STRATEGY_ID + " FROM user WHERE " + fields_1.EMAIL + "=?", [profile.emails[0].value])];
            case 4:
                data_1 = _e.sent();
                if (!data_1[0].length) return [3 /*break*/, 6];
                strategyId = data_1[0][0].strategy_id;
                return [4 /*yield*/, encrypt_decrypt_1.encryptDecrypt.compare(profile.id, strategyId).then(function (res) { return res ? { id: uuid_1.stringify(data_1[0][0].uuid) } : null; })];
            case 5:
                data_1 = _e.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, encrypt_decrypt_1.encryptDecrypt.encrypt(profile.id)];
            case 7:
                // create a hash to encrypt strategy_id
                data_1 = _e.sent();
                _e.label = 8;
            case 8:
                if (!(typeof data_1 == 'string')) return [3 /*break*/, 10];
                uuid = uuid_1.v4();
                time = general_1.convertTime();
                return [4 /*yield*/, db.insertWithValues("INSERT INTO `user` SET ?", (_b = {},
                        _b[fields_1.STRATEGY_ID] = data_1,
                        _b[fields_1.STRATEGY_TYPE] = 'google',
                        _b[fields_1.FIRST_NAME] = firstName,
                        _b[fields_1.LAST_NAME] = lastName,
                        _b[fields_1.MIDDLE_NAME] = middleName,
                        _b[fields_1.PROFILE_PIC_URL] = profilePicUrl,
                        _b[fields_1.EMAIL] = email,
                        _b[fields_1.UUID] = buffer_1.Buffer.from(uuid_1.parse(uuid)),
                        _b[fields_1.CREATED_AT] = time,
                        _b))];
            case 9:
                _e.sent();
                data_1 = uuid;
                return [3 /*break*/, 11];
            case 10:
                if (data_1) {
                    data_1 = data_1.id;
                }
                else {
                    throw new http_errors_1.default.Unauthorized('Invalid OAuth Credentials');
                }
                _e.label = 11;
            case 11:
                tokenObj = { email: profile.emails[0].value, id: data_1 };
                userID = data_1;
                accessTokenJWT = jwtUtils_1.utils.issueAccessTokenJWT(tokenObj);
                return [4 /*yield*/, jwtUtils_1.utils.issueRefreshTokenJWT(tokenObj)];
            case 12:
                data_1 = _e.sent();
                res.cookie(util_1.REFRESH_TOKEN, data_1.token, {
                    httpOnly: true,
                    maxAge: data_1.expiresInMs
                });
                res.status(200).json({ success: true, access_token: accessTokenJWT.token,
                    expiresIn: accessTokenJWT.expires,
                    username: firstName,
                    firstName: firstName,
                    lastName: lastName,
                    middleName: middleName,
                    userId: userID,
                    profilePicUrl: profilePicUrl
                });
                _e.label = 13;
            case 13: return [3 /*break*/, 16];
            case 14:
                err_1 = _e.sent();
                console.log(err_1);
                next(err_1);
                return [3 /*break*/, 16];
            case 15:
                db.close();
                return [7 /*endfinally*/];
            case 16: return [2 /*return*/];
        }
    });
}); });
registerRouter.post('/refresh-token', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, db, tokenObj, data, token, accessTokenJWT, response, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                refreshToken = req.cookies[util_1.REFRESH_TOKEN];
                db = new database_1.default();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                if (!refreshToken) {
                    throw new http_errors_1.default.Unauthorized("Refresh token not found");
                }
                return [4 /*yield*/, jwtUtils_1.utils.verifyRefreshToken(refreshToken)];
            case 2:
                tokenObj = _b.sent();
                if (!tokenObj.id)
                    throw new http_errors_1.default.Unauthorized();
                return [4 /*yield*/, db.connect()];
            case 3:
                _b.sent();
                return [4 /*yield*/, db.selectWithValues("SELECT " + fields_1.EMAIL + ", " + fields_1.FIRST_NAME + ", " + fields_1.MIDDLE_NAME + ", " + fields_1.LAST_NAME + ", " + fields_1.PROFILE_PIC_URL + " FROM user WHERE " + fields_1.UUID + "=?", [buffer_1.Buffer.from(uuid_1.parse(tokenObj.id))])];
            case 4:
                data = _b.sent();
                if (!data[0].length) {
                    throw new http_errors_1.default.InternalServerError("Cannot find user");
                }
                data = (_a = {},
                    _a[fields_1.FIRST_NAME] = data[0][0][fields_1.FIRST_NAME],
                    _a[fields_1.MIDDLE_NAME] = data[0][0][fields_1.MIDDLE_NAME],
                    _a[fields_1.LAST_NAME] = data[0][0][fields_1.LAST_NAME],
                    _a[fields_1.PROFILE_PIC_URL] = data[0][0][fields_1.PROFILE_PIC_URL],
                    _a[fields_1.EMAIL] = data[0][0][fields_1.EMAIL],
                    _a);
                token = __assign(__assign({}, tokenObj), { email: data[fields_1.EMAIL] });
                accessTokenJWT = jwtUtils_1.utils.issueAccessTokenJWT(token);
                return [4 /*yield*/, jwtUtils_1.utils.issueRefreshTokenJWT(token)];
            case 5:
                response = _b.sent();
                res.cookie(util_1.REFRESH_TOKEN, response.token, {
                    httpOnly: true,
                    maxAge: response.expiresInMs
                });
                res.status(200).json({ success: true, access_token: accessTokenJWT.token,
                    expiresIn: accessTokenJWT.expires,
                    userId: tokenObj.id,
                    firstName: data[fields_1.FIRST_NAME],
                    lastName: data[fields_1.LAST_NAME],
                    middleName: data[fields_1.MIDDLE_NAME],
                    profilePicUrl: data[fields_1.PROFILE_PIC_URL]
                });
                return [3 /*break*/, 8];
            case 6:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 8];
            case 7:
                db.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
registerRouter.delete('/logout', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                refreshToken = req.cookies[util_1.REFRESH_TOKEN];
                if (!refreshToken) {
                    throw new http_errors_1.default.Unauthorized();
                }
                return [4 /*yield*/, jwtUtils_1.utils.verifyRefreshToken(refreshToken)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, redis_server_1.delRedis(response.id)];
            case 2:
                _a.sent();
                res.sendStatus(204);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = registerRouter;
