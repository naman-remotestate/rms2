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
exports.logout = exports.addAddress = exports.getAllDishes = exports.getAllRestaurants = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userdbqueries_1 = require("../helpers/userdbqueries");
const sessiondbqueries_1 = require("../helpers/sessiondbqueries");
const restaurantdbqueries_1 = require("../helpers/restaurantdbqueries");
const dishesdbqueries_1 = require("../helpers/dishesdbqueries");
const rolesdbqueries_1 = require("../helpers/rolesdbqueries");
const addressdbqueries_1 = require("../helpers/addressdbqueries");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, mobile_no } = req.body;
    try {
        const data = yield (0, userdbqueries_1.getUserByEmail)(email);
        if (data) {
            const error = new Error("user already exists in database");
            error.statusCode = 409;
            error.messageToClient = "user already exists";
            return next(error);
        }
        const salt = yield bcrypt_1.default.genSalt();
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const userId = yield (0, userdbqueries_1.insertUser)(username, hashPassword, email, mobile_no);
        yield (0, userdbqueries_1.insertCreatedBy)(userId, userId);
        yield (0, rolesdbqueries_1.insertRole)(userId, 'user');
        const ssid = yield (0, sessiondbqueries_1.createSession)(userId);
        const user = { ssid, userId, username, email };
        const accessToken = jsonwebtoken_1.default.sign(user, (process.env.ACCESS_TOKEN_SECRET), { expiresIn: '20min' });
        res.json({ accessToken: accessToken });
    }
    catch (e) {
        next(e);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const userInfo = yield (0, userdbqueries_1.getUserByEmail)(email);
    const userPassword = userInfo.password;
    const userId = userInfo.user_id;
    const dbUsername = userInfo.rows[0].username;
    try {
        if (username === dbUsername && (yield bcrypt_1.default.compare(password, userPassword))) {
            const ssid = yield (0, sessiondbqueries_1.createSession)(userId);
            const user = { ssid, userId, username, email };
            const accessToken = jsonwebtoken_1.default.sign(user, (process.env.ACCESS_TOKEN_SECRET), { expiresIn: '20min' });
            res.json({ accessToken });
        }
        else {
            const error = new Error("invalid credentials");
            error.statusCode = 400;
            error.messageToClient = "invalid credentials";
            return next(error);
        }
    }
    catch (e) {
        next(e);
    }
});
exports.login = login;
const getAllRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield (0, restaurantdbqueries_1.getRestaurants)();
        res.send(resData);
    }
    catch (e) {
        const error = new Error("not able fetch restaurants");
        error.messageToClient = "unable to fetch restaurants";
        return next(error);
    }
});
exports.getAllRestaurants = getAllRestaurants;
const getAllDishes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { res_id } = req.params;
    try {
        const dishesData = yield (0, dishesdbqueries_1.getDishes)(res_id);
        res.send(dishesData);
    }
    catch (e) {
        const error = new Error("not able to fetch dishes");
        error.messageToClient = "unable to fetch dishes";
        return next(error);
    }
});
exports.getAllDishes = getAllDishes;
const addAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, user_location } = req.body;
    const userId = req.user.userId;
    try {
        yield (0, addressdbqueries_1.insertAddress)(userId, address, user_location);
        res.send("address added successfully");
    }
    catch (e) {
        const error = new Error("not able to add address");
        error.messageToClient = "something went wrong";
        return next(error);
    }
});
exports.addAddress = addAddress;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ssid = req.user.ssid;
    try {
        yield (0, sessiondbqueries_1.endSession)(ssid);
        res.send("you are successfully logged out");
    }
    catch (e) {
        const error = new Error("not able to fetch restaurants");
        error.messageToClient = "unable to fetch restaurants";
        return next(error);
    }
});
exports.logout = logout;
