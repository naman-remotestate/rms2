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
exports.logout = exports.createUser = exports.addDish = exports.AddRestaurant = exports.getAllDishes = exports.getAllRestaurants = exports.getAllUsers = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userdbqueries_1 = require("../helpers/userdbqueries");
const rolesdbqueries_1 = require("../helpers/rolesdbqueries");
const restaurantdbqueries_1 = require("../helpers/restaurantdbqueries");
const dishesdbqueries_1 = require("../helpers/dishesdbqueries");
const sessiondbqueries_1 = require("../helpers/sessiondbqueries");
const role_types = ['admin', 'subadmin', 'user'];
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const userInfo = yield (0, userdbqueries_1.searchUserWithRole)(email, role_types[1]);
        if (!userInfo) {
            const error = new Error("not a subadmin");
            error.statusCode = 403;
            error.messageToClient = "you are not a subadmin";
            return next(error);
        }
        const fromDbUsername = userInfo.username;
        const fromDbPassword = userInfo.password;
        const userId = userInfo.user_id;
        if (username !== fromDbUsername && !(yield bcrypt_1.default.compare(password, fromDbPassword))) {
            const error = new Error("invalid credentials");
            error.statusCode = 401;
            error.messageToClient = "invalid credentials";
            return next(error);
        }
        const ssid = yield (0, sessiondbqueries_1.createSession)(userId);
        const user = { ssid, userId, username, email };
        const accessToken = jsonwebtoken_1.default.sign(user, (process.env.ACCESS_TOKEN_SECRET), { expiresIn: '30min' });
        res.json({ accessToken: accessToken });
    }
    catch (e) {
        next(e);
    }
});
exports.login = login;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    try {
        const userInfo = yield (0, userdbqueries_1.getUsersCreatedBySubadmin)(userId);
        res.send(userInfo);
    }
    catch (e) {
        const error = new Error("couldn't fetch users");
        error.messageToClient = "unable to fetch users";
        return next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getAllRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    try {
        const resInfo = yield (0, restaurantdbqueries_1.getRestaurantsCreatedBySubadmin)(userId);
        res.send(resInfo);
    }
    catch (e) {
        const error = new Error("couldn't fetch restaurants");
        error.messageToClient = "unable to fetch restaurants";
        return next(error);
    }
});
exports.getAllRestaurants = getAllRestaurants;
const getAllDishes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { res_id } = req.params;
    try {
        const dishInfo = yield (0, dishesdbqueries_1.getDishesCreatedBySubadmin)(userId, res_id);
        res.send(dishInfo);
    }
    catch (e) {
        const error = new Error("couldn't fetch dishes");
        error.messageToClient = "unable to fetch dishes";
        return next(error);
    }
});
exports.getAllDishes = getAllDishes;
const AddRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { res_name, address, res_location } = req.body;
    const userId = req.user.userId;
    try {
        yield (0, restaurantdbqueries_1.addRestaurant)(userId, res_name, address, res_location);
        res.send("restaurant is successfully added");
    }
    catch (e) {
        const error = new Error("couldn't add restaurant");
        error.messageToClient = "unable to add restaurants";
        return next(error);
    }
});
exports.AddRestaurant = AddRestaurant;
const addDish = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { dish } = req.body;
    const { res_id } = req.params;
    const userId = req.user.userId;
    const dishName = dish.toLowerCase();
    try {
        yield (0, dishesdbqueries_1.insertDish)(userId, res_id, dishName);
        res.send("dish is successfully added");
    }
    catch (e) {
        const error = new Error("dish already exists");
        error.statusCode = 409;
        error.messageToClient = "dish already exists";
        return next(error);
    }
});
exports.addDish = addDish;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, mobile_no } = req.body;
    const userId = req.user.userId;
    try {
        const data = yield (0, userdbqueries_1.getUserByEmail)(email);
        if (!data) {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const newUserId = yield (0, userdbqueries_1.insertUser)(username, hashedPassword, email, mobile_no);
            yield (0, userdbqueries_1.insertCreatedBy)(newUserId, userId);
            yield (0, rolesdbqueries_1.insertRole)(newUserId, role_types[2]);
            res.send("user succesfully created");
        }
        else {
            const newUserId = data.user_id;
            const userInfo = yield (0, rolesdbqueries_1.searchRole)(newUserId, role_types[2]);
            if (!userInfo) {
                yield (0, rolesdbqueries_1.insertRole)(newUserId, role_types[2]);
                res.send("user is successfully created");
            }
            else
                res.send("it is already a user");
        }
    }
    catch (e) {
        const error = new Error("error in creating user");
        error.messageToClient = "unable to create user";
        return next(error);
    }
});
exports.createUser = createUser;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ssid = req.user.ssid;
    try {
        yield (0, sessiondbqueries_1.endSession)(ssid);
        res.send("you are successfully logout");
    }
    catch (e) {
        const error = new Error("not able to logout");
        error.messageToClient = "something went wrong";
        return next(error);
    }
});
exports.logout = logout;
