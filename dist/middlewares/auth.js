"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool = require('../db');
;
const authToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null)
        return res.send("invalid user");
    jsonwebtoken_1.default.verify(token, (process.env.ACCESS_TOKEN_SECRET), (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        const ssid = req.user.ssid;
        try {
            const sessInfo = yield pool.query('select end_time from sessiondb where ssid = $1', [ssid]);
            if (sessInfo.rows[0].end_time) {
                res.send("You are logged out , please login again");
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
        next();
    }));
};
exports.authToken = authToken;
