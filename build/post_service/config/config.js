"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var serverSettings = {
    port: process.env.POST_SERVICE_PORT
};
exports.config = Object.assign({}, { serverSettings: serverSettings });
