"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGODB_URI = void 0;
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/melo';
exports.PORT = process.env.PORT || 3000;
