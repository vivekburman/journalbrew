"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeyPair = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function generateKeyPair() {
    var accessTokenPublicKeyPath = path_1.default.join(__dirname, '../id_access_rsa_pub.pem');
    var accessTokenPrivateKeyPath = path_1.default.join(__dirname, '../id_access_rsa_prv.pem');
    var refreshTokenPublicKeyPath = path_1.default.join(__dirname, '../id_refresh_rsa_pub.pem');
    var refreshTokenPrivateKeyPath = path_1.default.join(__dirname, '../id_refresh_rsa_prv.pem');
    try {
        if (fs_1.default.existsSync(accessTokenPublicKeyPath) && fs_1.default.existsSync(accessTokenPrivateKeyPath)
            && fs_1.default.existsSync(refreshTokenPublicKeyPath) && fs_1.default.existsSync(refreshTokenPrivateKeyPath)) {
            return;
        }
    }
    catch (err) {
        console.log('Error Check if KEYPAIR files are correct or file name and exstension is correct = ', err);
        return;
    }
    var accessTokenKeyPair = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    var refreshTokenKeyPair = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
    fs_1.default.writeFileSync(accessTokenPublicKeyPath, accessTokenKeyPair.publicKey);
    fs_1.default.writeFileSync(accessTokenPrivateKeyPath, accessTokenKeyPair.privateKey);
    fs_1.default.writeFileSync(refreshTokenPublicKeyPath, refreshTokenKeyPair.publicKey);
    fs_1.default.writeFileSync(refreshTokenPrivateKeyPath, refreshTokenKeyPair.privateKey);
}
exports.generateKeyPair = generateKeyPair;
