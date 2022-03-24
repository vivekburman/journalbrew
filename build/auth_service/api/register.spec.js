"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
/**
 * Test cases for
 * 1. Login
 * 2. Logout
 * 3. Refresh Token
 * 4. Verify AccessToken
 * 5. verify RefreshToken
 * 6. Protected Route
 */
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var chai_1 = __importStar(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var jwtUtils_1 = require("../utils/jwtUtils");
var server_1 = require("../server/server");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var sinon_1 = __importDefault(require("sinon"));
var uuid_1 = require("uuid");
var token = uuid_1.v4();
// const should_ = chai.should();
chai_1.default.use(chai_http_1.default);
chai_1.default.use(sinon_chai_1.default);
var app = server_1.server.start(3000);
var pathToPrivateKeyAccessToken = path_1.default.join(__dirname, '../id_access_rsa_prv.pem');
var PRV_KEY_ACCESS_TOKEN = fs_1.default.readFileSync(pathToPrivateKeyAccessToken, 'utf-8');
var pathToPublicKeyAccessToken = path_1.default.join(__dirname, '../id_access_rsa_pub.pem');
var PUB_KEY_ACCESS_TOKEN = fs_1.default.readFileSync(pathToPublicKeyAccessToken, 'utf-8');
var pathToPrivateKeyRefreshToken = path_1.default.join(__dirname, '../id_refresh_rsa_prv.pem');
var PRV_KEY_REFRESH_TOKEN = fs_1.default.readFileSync(pathToPrivateKeyRefreshToken, 'utf-8');
var pathToPublicKeyRefreshToken = path_1.default.join(__dirname, '../id_refresh_rsa_pub.pem');
var PUB_KEY_REFRESH_TOKEN = fs_1.default.readFileSync(pathToPublicKeyRefreshToken, 'utf-8');
var createToken = function (token, key, expiresIn) {
    return jsonwebtoken_1.default.sign(token, key, {
        expiresIn: expiresIn,
        algorithm: 'RS256',
        issuer: 'journalbrew.com',
    });
};
var verifyToken = function (token, key) {
    return jsonwebtoken_1.default.verify(token, key);
};
process.on('uncaughtException', function () {
    console.log('exiting.....');
    process.exit(1);
});
describe('Test Cases for Authentication & Authorization and Auth Server', function () {
    var accessToken, refreshToken;
    it('Generate Access Token', function (done) {
        accessToken = jwtUtils_1.utils.issueAccessTokenJWT({
            email: 'abc@gmail.com',
            id: uuid_1.v4()
        });
        chai_1.expect(accessToken.expires).equal('15m');
        chai_1.expect(accessToken.token).to.be.a('string');
        done();
    });
    it('Verify Access Token', function (done) {
        var next = sinon_1.default.spy();
        jwtUtils_1.utils.verifyAccessToken({
            headers: {
                'authorization': accessToken.token
            }
        }, {}, next);
        chai_1.expect(next).to.have.been.called;
        done();
    });
    it('Generate Refresh Token', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jwtUtils_1.utils.issueRefreshTokenJWT({
                        email: 'abc@gmail.com',
                        id: token
                    })];
                case 1:
                    refreshToken = _a.sent();
                    chai_1.expect(refreshToken.expires).to.equal('1y');
                    return [2 /*return*/];
            }
        });
    }); });
    it('Verify Refresh Token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jwtUtils_1.utils.verifyRefreshToken(refreshToken.token)];
                case 1:
                    token = _a.sent();
                    chai_1.expect(token.id).to.equal(token);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Check Access Token Expired', function () {
        var token = createToken({
            email: 'abc@gmail.com',
            iat: Math.floor(Date.now() / (1000 * 60) - 16)
        }, PRV_KEY_ACCESS_TOKEN, '15m');
        var func = function () { return verifyToken(token, PUB_KEY_ACCESS_TOKEN); };
        chai_1.expect(func).to.throw(jsonwebtoken_1.TokenExpiredError);
    });
    it('Check Refresh Token Expired', function () {
        var date_ = new Date();
        date_.setFullYear(date_.getFullYear() - 1);
        var token = createToken({
            email: 'abc@gmail.com',
            iat: (+date_) / 1000
        }, PRV_KEY_REFRESH_TOKEN, '1y');
        var func = function () { return verifyToken(token, PUB_KEY_REFRESH_TOKEN); };
        chai_1.expect(func).to.throw(jsonwebtoken_1.TokenExpiredError);
    });
});
