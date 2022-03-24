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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// start all the servers/services and the database
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var genKeyPair_1 = require("./auth_service/utils/genKeyPair");
genKeyPair_1.generateKeyPair();
var auth_service_1 = require("./auth_service");
var post_service_1 = require("./post_service");
var user_info_service_1 = require("./user_info_service");
var search_service_1 = require("./search_service");
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var servers = [];
var closeAllServers = function () {
    console.log('closing all servers');
    servers.forEach(function (i) {
        i && (i instanceof http.Server || i instanceof https.Server) && i.close();
    });
};
process.on('uncaughtException', function (err) {
    console.log('Uncaught Exception = ', err);
});
process.on('unhandledRejection', function (err) {
    console.log('Unhandled Rejection = ', err);
});
process.on('SIGINT', function () {
    closeAllServers();
});
Promise.all([
    auth_service_1.authService.startService(),
    post_service_1.postService.startService(),
    user_info_service_1.userInfoService.startService(),
    search_service_1.searchService.startService()
])
    .then(function (res) {
    res.forEach(function (i) { return servers.push(i); });
})
    .catch(function (err) {
    console.log('ERROR!', err);
});
