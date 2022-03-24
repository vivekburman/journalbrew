"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
var search_1 = __importDefault(require("./search"));
exports.registerRoutes = function (app) {
    app.use('/search', search_1.default);
};
