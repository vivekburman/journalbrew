"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTime = void 0;
exports.convertTime = function (time) {
    return time ? new Date(time).toISOString().slice(0, 19).replace('T', ' ')
        : new Date().toISOString().slice(0, 19).replace('T', ' ');
};
