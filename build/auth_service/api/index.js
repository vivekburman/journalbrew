"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
var register_1 = __importDefault(require("./register"));
exports.registerRoutes = function (app) {
    if (typeof app.use === 'function') {
        app.use('/auth', register_1.default);
    }
};
