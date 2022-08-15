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
exports.getDishesCreatedBySubadmin = exports.insertDish = exports.getDishes = void 0;
const pool = require('../db');
const getDishes = (resId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select res_id,dish from dishesdb where is_archived=false and res_id='${resId}')
                                     select * from cte_temp as temp
                                     join (select count(*) from cte_temp) as total_count
                                     on true
                                     order by temp.dish
                                    `);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getDishes = getDishes;
const insertDish = (user_id, res_id, dish) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`insert into dishesdb (user_id,res_id,dish) values ('${user_id}','${res_id}','${dish}')`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.insertDish = insertDish;
const getDishesCreatedBySubadmin = (userId, resId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select res_id ,user_id,dish from 
                                      dishesdb where is_archived = false and
                                      user_id = '${userId}' and res_id = '${resId}')
                                      select * from cte_temp as temp
                                      join (select count(*) from cte_temp) as cte
                                      on true
                                      order by temp.dish `);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getDishesCreatedBySubadmin = getDishesCreatedBySubadmin;
