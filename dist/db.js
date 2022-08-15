"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const pg_1 = require("pg");
const config_1 = __importDefault(require("./src/database/config"));
const args = config_1.default["dev"];
const pool = new pg_1.Pool(args);
exports.default = pool;
