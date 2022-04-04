"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delRedis = exports.setRedis = exports.getRedis = exports.initRedis = void 0;
var redis_1 = __importDefault(require("redis"));
var http_errors_1 = __importDefault(require("http-errors"));
var client;
exports.initRedis = function () {
    client = redis_1.default.createClient({
        port: 6379,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD
    });
    client.on("error", function (err) {
        console.log('Redis error = ', err);
    });
    client.on("connect", function () {
        console.log('--Redis Connected--');
    });
    client.on("end", function () {
        console.log('--Closing Redis--');
    });
    process.on('SIGINT', function () {
        client.quit();
    });
};
exports.getRedis = function (key) {
    return new Promise(function (resolve, reject) {
        client.GET(key, function (err, reply) {
            if (err)
                return reject(new http_errors_1.default.InternalServerError());
            resolve(reply);
        });
    });
};
exports.setRedis = function (key, value) {
    return new Promise(function (resolve, reject) {
        var expireTime = 365 * 24 * 60 * 60;
        client.SET(key, value, 'EX', expireTime, function (err, reply) {
            if (err)
                return reject(new http_errors_1.default.InternalServerError());
            resolve(reply);
        });
    });
};
exports.delRedis = function (key) {
    return new Promise(function (resolve, reject) {
        client.DEL(key, function (err, reply) {
            if (err)
                return reject(new http_errors_1.default.InternalServerError());
            resolve(reply);
        });
    });
};
