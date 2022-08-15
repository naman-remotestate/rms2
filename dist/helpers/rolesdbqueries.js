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
exports.setRoleOfUser = exports.insertRole = exports.searchRole = void 0;
const pool = require('../db');
const searchRole = (user_id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`select user_id,role_type from responsibilities where user_id='${user_id}' 
                                        and role_type='${role}'
                                         and is_archived = false`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e);
    }
});
exports.searchRole = searchRole;
const insertRole = (user_id, role_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`insert into responsibilities (user_id,role_type) values ('${user_id}','${role_type}')`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.insertRole = insertRole;
const setRoleOfUser = (user_id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`insert into responsibilities (user_id,role_type) values('${user_id}','${role}'})`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.setRoleOfUser = setRoleOfUser;
