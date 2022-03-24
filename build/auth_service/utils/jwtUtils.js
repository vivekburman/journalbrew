"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var http_errors_1 = __importDefault(require("http-errors"));
var redis_server_1 = require("../server/redis.server");
var ms_1 = __importDefault(require("ms"));
var pathToPrivateKeyAccessToken = path_1.default.join(__dirname, '../id_access_rsa_prv.pem');
var PRV_KEY_ACCESS_TOKEN = fs_1.default.readFileSync(pathToPrivateKeyAccessToken, 'utf-8');
var pathToPublicKeyAccessToken = path_1.default.join(__dirname, '../id_access_rsa_pub.pem');
var PUB_KEY_ACCESS_TOKEN = fs_1.default.readFileSync(pathToPublicKeyAccessToken, 'utf-8');
var pathToPrivateKeyRefreshToken = path_1.default.join(__dirname, '../id_refresh_rsa_prv.pem');
var PRV_KEY_REFRESH_TOKEN = fs_1.default.readFileSync(pathToPrivateKeyRefreshToken, 'utf-8');
var pathToPublicKeyRefreshToken = path_1.default.join(__dirname, '../id_refresh_rsa_pub.pem');
var PUB_KEY_REFRESH_TOKEN = fs_1.default.readFileSync(pathToPublicKeyRefreshToken, 'utf-8');
var issueAccessTokenJWT = function (userID) {
    var expiresIn = '15m';
    var payload = {
        email: userID.email,
        id: userID.id
    };
    var signedToken = jsonwebtoken_1.default.sign(payload, PRV_KEY_ACCESS_TOKEN, {
        expiresIn: expiresIn,
        algorithm: 'RS256',
        issuer: 'journalbrew.com',
        audience: userID.email
    });
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    };
};
var issueRefreshTokenJWT = function (userID) {
    var expiresIn = '1y'; // 1y, 15m, 30d
    var payload = {
        email: userID.email,
        id: userID.id
    };
    var signedToken = jsonwebtoken_1.default.sign(payload, PRV_KEY_REFRESH_TOKEN, {
        expiresIn: expiresIn,
        algorithm: 'RS512',
        issuer: 'journalbrew.com',
        audience: JSON.stringify(userID)
    });
    return redis_server_1.setRedis(userID.id, signedToken)
        .then(function () {
        return {
            token: signedToken,
            expires: expiresIn,
            expiresInMs: ms_1.default(expiresIn)
        };
    });
};
var verifyAccessToken = function (req_, res, next) {
    var req = req_;
    if (!req.headers['authorization']) {
        return next(new http_errors_1.default.Unauthorized('Unauthorized Error'));
    }
    var authHeader = req.headers['authorization'];
    var bearerToken = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(bearerToken, PUB_KEY_ACCESS_TOKEN, function (err, payload) {
        if (err) {
            return err.name == 'JsonWebTokenError' ? next(new http_errors_1.default.Unauthorized()) : next(new http_errors_1.default.Unauthorized(err.message));
        }
        req['payload'] = payload;
        next();
    });
};
var verifyRefreshToken = function (refreshToken) {
    var user = { id: '' };
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(refreshToken, PUB_KEY_REFRESH_TOKEN, function (err, payload) {
            if (err) {
                return reject(new http_errors_1.default.Unauthorized());
            }
            user = JSON.parse(payload.aud);
            redis_server_1.getRedis(user.id)
                .then(function (res) {
                if (res === refreshToken) {
                    return resolve(user);
                }
                return reject(new http_errors_1.default.Unauthorized());
            });
        });
    });
};
exports.utils = Object.assign({}, {
    issueAccessTokenJWT: issueAccessTokenJWT,
    issueRefreshTokenJWT: issueRefreshTokenJWT,
    verifyAccessToken: verifyAccessToken,
    verifyRefreshToken: verifyRefreshToken,
});
