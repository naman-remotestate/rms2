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
exports.searchUserWithRole = exports.getUsersCreatedBySubadmin = exports.getSubadmins = exports.insertCreatedBy = exports.insertUser = exports.getUserByEmail = exports.getUsersById = exports.getAllUser = void 0;
const pool = require('../db');
const addressdbqueries_1 = require("./addressdbqueries");
const getAllUser = (offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select user_id,username,email,mobile_no from userdb)
                                        select * from cte_temp as temp
                                        join (select count(*) from cte_temp ) as cte
                                        on true
                                        join responsibilities as res
                                        on temp.user_id = res.user_id
                                        where is_archived=false and
                                        role_type='user'
                                        order by username
                                        limit ${limit} offset ${offset}`);
        const userIds = data.rows.map(({ user_id }) => {
            return user_id;
        });
        const addressInfo = yield (0, addressdbqueries_1.getAllAddress)(userIds);
        const userInfo = [];
        data.rows.forEach(({ user_id, username, email, mobile_no }) => {
            const obj = {
                username,
                email,
                mobile_no,
                address: (addressInfo.get(user_id)) ? addressInfo.get(user_id) : []
            };
            userInfo.push(obj);
        });
        return userInfo;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllUser = getAllUser;
const getUsersById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`select user_id,username,email,password,mobile_no from userdb where user_id = '${user_id}'
                                       and is_archived = false`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e);
    }
});
exports.getUsersById = getUsersById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`select user_id,username,password,email from userdb where email='${email}' and is_archived=false`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e);
    }
});
exports.getUserByEmail = getUserByEmail;
const insertUser = (username, password, email, mobileNo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield pool.query(`insert into userdb(username,password,email,mobile_no) 
                                            values('${username}','${password}','${email}',
                                            '${mobileNo}') returning user_id`);
        return userInfo.rows[0].user_id;
    }
    catch (e) {
        return e;
    }
});
exports.insertUser = insertUser;
const insertCreatedBy = (userId, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`update userdb set created_by = '${createdBy}' where user_id = '${userId}' `);
    }
    catch (e) {
        console.log(e);
    }
});
exports.insertCreatedBy = insertCreatedBy;
const getSubadmins = (roleType, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(` with cte_temp as(select username,email,user_id from userdb)  
                                            select *  from cte_temp as temp
                                            join (select count(*) from cte_temp) as total on TRUE
                                            join responsibilities as res on temp.user_id = res.user_id
                                            where role_type='${roleType}'
                                            order by temp.username
                                            limit ${limit} offset ${offset} `);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getSubadmins = getSubadmins;
const getUsersCreatedBySubadmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select user_id,username,email from userdb
                                        where created_by = '${userId}' and is_archived=false)
                                        select * from cte_temp as temp 
                                        inner join (select count(*) from cte_temp) as cte on true
                                        inner join responsibilities as res
                                        on temp.user_id = res.user_id
                                        where res.role_type='user'
                                        order by temp.username`);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getUsersCreatedBySubadmin = getUsersCreatedBySubadmin;
const searchUserWithRole = (email, roleType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`select user_id,username,email,password from userdb as users
                                        inner join responsibilities as res
                                        using(user_id)
                                        where email='${email}' and role_type= '${roleType}' 
                                        and users.is_archived=false
                                           `);
        return data.rows[0];
    }
    catch (e) {
        console.log(e);
    }
});
exports.searchUserWithRole = searchUserWithRole;
