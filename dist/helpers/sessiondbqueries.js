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
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSession = exports.createSession = void 0;
const pool = require('../db');
const createSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ssInfo = yield pool.query(`insert into sessiondb (user_id) values ('${userId}') returning ssid`);
        return ssInfo.rows[0].ssid;
    }
    catch (e) {
        console.log(e);
    }
});
exports.createSession = createSession;
const endSession = (ssid) => __awaiter(void 0, void 0, void 0, function* () {
    const currDate = new Date();
    const endTime = currDate.toISOString();
    try {
        yield pool.query(`update sessiondb set end_time = '${endTime}' , is_ended = true `);
    }
    catch (e) {
        console.log(e);
    }
});
exports.endSession = endSession;
