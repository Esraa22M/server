"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variables_1 = require("./utils/variables");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db");
const app = (0, express_1.default)();
app.listen(variables_1.PORT, () => {
    console.log(`Server is running on port ${variables_1.PORT}`);
});
