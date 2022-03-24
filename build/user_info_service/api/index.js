"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
var userInfo_1 = __importDefault(require("./userInfo"));
exports.registerRoutes = function (app) {
    app.use('/user-info', userInfo_1.default);
};
