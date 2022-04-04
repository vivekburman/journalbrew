"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptDecrypt = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var saltRounds = 12;
var compare = function (param, encryptedparam) { return bcrypt_1.default.compare(param, encryptedparam); };
var compareSync = function (param, encryptedparam) { return bcrypt_1.default.compareSync(param, encryptedparam); };
var encrypt = function (param, rounds) {
    if (rounds === void 0) { rounds = saltRounds; }
    return bcrypt_1.default.hash(param, rounds);
};
var encryptSync = function (param, rounds) {
    if (rounds === void 0) { rounds = saltRounds; }
    return bcrypt_1.default.hashSync(param, rounds);
};
exports.encryptDecrypt = Object.assign({}, {
    compare: compare,
    compareSync: compareSync,
    encrypt: encrypt,
    encryptSync: encryptSync
});
