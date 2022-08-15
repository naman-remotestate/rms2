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
exports.getRestaurantsCreatedBySubadmin = exports.getRestaurants = exports.addRestaurant = void 0;
const pool = require('../db');
const addRestaurant = (userId, resName, address, location) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.query(`insert into restaurantdb (user_id,address,res_location,res_name) values ('${userId}','${address}','${location}','${resName}')`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addRestaurant = addRestaurant;
const getRestaurants = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select res_name,address from restaurantdb where is_archived=false)
                                         select * from cte_temp as temp
                                         join (select count(*) from cte_temp ) as cte
                                         on true
                                         order by temp.res_name
                                        `);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getRestaurants = getRestaurants;
const getRestaurantsCreatedBySubadmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield pool.query(`with cte_temp as (select user_id,res_name,address from 
                                        restaurantdb where is_archived = false and
                                        user_id ='${userId}')
                                        select * from cte_temp as temp
                                        join (select count(*) from cte_temp) as cte
                                        on true 
                                        order by temp.res_name`);
        return data.rows;
    }
    catch (e) {
        console.log(e);
    }
});
exports.getRestaurantsCreatedBySubadmin = getRestaurantsCreatedBySubadmin;
