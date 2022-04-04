"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var serverSettings = {
    port: process.env.SEARCH_SERVICE_PORT
};
exports.config = Object.assign({}, { serverSettings: serverSettings });
