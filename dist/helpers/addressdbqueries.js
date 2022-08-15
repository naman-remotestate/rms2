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
exports.getAllAddress = exports.insertAddress = void 0;
const pool = require('../db');
const insertAddress = (userId, address, userLocation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`insert into addressdb(user_id,address,user_location)
                          values ('${userId}','${address}','${userLocation}') `);
    }
    catch (e) {
        console.log(e);
    }
});
exports.insertAddress = insertAddress;
const getAllAddress = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query('select user_id,address from addressdb where is_archived = false and user_id = ANY ($1)', [userIds]);
        const allAddress = data.rows;
        const map = new Map();
        allAddress.forEach((info) => {
            const userInfo = info;
            if (map.has(userInfo.user_id)) {
                const list = map.get(userInfo.user_id);
                list.push(userInfo.address);
            }
            else {
                const list = [];
                list.push(userInfo.address);
                map.set(userInfo.user_id, list);
            }
        });
        return map;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllAddress = getAllAddress;
