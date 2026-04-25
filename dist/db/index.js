"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../utils/variables");
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(variables_1.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
exports.default = mongoose_1.default;
