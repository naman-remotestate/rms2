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
exports.logout = exports.getAllUsers = exports.getAllDishes = exports.getAllRestaurants = exports.getAllSubAdmins = exports.addDish = exports.AddRestaurant = exports.createAdmin = exports.createSubadmin = exports.createUser = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userdbqueries_1 = require("../helpers/userdbqueries");
const rolesdbqueries_1 = require("../helpers/rolesdbqueries");
const restaurantdbqueries_1 = require("../helpers/restaurantdbqueries");
const dishesdbqueries_1 = require("../helpers/dishesdbqueries");
const sessiondbqueries_1 = require("../helpers/sessiondbqueries");
const role_types = ['admin', 'subadmin', 'user'];
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const data = yield (0, userdbqueries_1.getUserByEmail)(email);
        if (!data) {
            const error = new Error("email not found");
            error.statusCode = 400;
            error.messageToClient = "email not found";
            return next(error);
        }
        const fromDbUsername = data.username;
        const fromDbPassword = data.password;
        const userId = data.user_id;
        const fromDbData = yield (0, rolesdbqueries_1.searchRole)(userId, 'admin');
        if (!fromDbData) {
            const error = new Error("not a subadmin");
            error.statusCode = 403;
            error.messageToClient = "you are not a subadmin";
            return next(error);
        }
        if (username !== fromDbUsername && !(yield bcrypt_1.default.compare(password, fromDbPassword)))
            res.send("invalid credentials");
        const ssid = yield (0, sessiondbqueries_1.createSession)(userId);
        const user = { ssid, userId, username, email };
        const accessToken = jsonwebtoken_1.default.sign(user, (process.env.ACCESS_TOKEN_SECRET), { expiresIn: '30min' });
        res.json({ accessToken: accessToken });
    }
    catch (e) {
        next(e);
    }
});
exports.adminLogin = adminLogin;
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
            const newUserId = data.rows[0].user_id;
            const data1 = yield (0, rolesdbqueries_1.searchRole)(newUserId, role_types[2]);
            if (!data1) {
                yield (0, rolesdbqueries_1.insertRole)(newUserId, role_types[2]);
                res.send("user is successfully created");
            }
            else
                res.send("it is already a user");
        }
    }
    catch (e) {
        res.send(e);
    }
});
exports.createUser = createUser;
const createSubadmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, mobile_no } = req.body;
    const userId = req.user.userId;
    try {
        const data = yield (0, userdbqueries_1.getUserByEmail)(email);
        if (!data) {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const newUserId = yield (0, userdbqueries_1.insertUser)(username, hashedPassword, email, mobile_no);
            yield (0, userdbqueries_1.insertCreatedBy)(newUserId, userId);
            yield (0, rolesdbqueries_1.insertRole)(newUserId, role_types[1]);
            res.send("subadmin succesfully created");
        }
        else {
            const usersId = data.user_id;
            const data1 = yield (0, rolesdbqueries_1.searchRole)(usersId, role_types[1]);
            if (!data1) {
                yield (0, rolesdbqueries_1.insertRole)(usersId, role_types[1]);
                res.send("subadmin is successfully created");
            }
            else
                res.send("given user is already a subadmin");
        }
    }
    catch (e) {
        res.send(e);
    }
});
exports.createSubadmin = createSubadmin;
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, mobile_no } = req.body;
    const userId = req.user.userId;
    try {
        const data = yield (0, userdbqueries_1.getUserByEmail)(email);
        if (!data) {
            const salt = yield bcrypt_1.default.genSalt();
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const newUserId = yield (0, userdbqueries_1.insertUser)(username, hashedPassword, email, mobile_no);
            yield (0, userdbqueries_1.insertCreatedBy)(newUserId, userId);
            yield (0, rolesdbqueries_1.insertRole)(newUserId, role_types[0]);
            res.send("admin succesfully created");
        }
        else {
            const usersId = data.rows[0].user_id;
            const data1 = yield (0, rolesdbqueries_1.searchRole)(usersId, role_types[0]);
            if (!data1) {
                yield (0, rolesdbqueries_1.insertRole)(usersId, role_types[0]);
                res.send("admin is successfully created");
            }
            else
                res.send("given user is already a admin");
        }
    }
    catch (e) {
        res.send(e);
    }
});
exports.createAdmin = createAdmin;
const AddRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { res_name, address, res_location } = req.body;
    const userId = req.user.userId;
    console.log(userId);
    try {
        yield (0, restaurantdbqueries_1.addRestaurant)(userId, res_name, address, res_location);
        res.send("restaurant is successfully added");
    }
    catch (e) {
        console.log(e);
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
        const error = new Error("unable to add dish");
        error.messageToClient = "unable to add dish";
        return next(error);
    }
});
exports.addDish = addDish;
const getAllSubAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 5;
    const offset = 0;
    try {
        const data = yield (0, userdbqueries_1.getSubadmins)(role_types[1], limit, offset);
        res.json(data);
    }
    catch (e) {
        const error = new Error("not able to fetch subadmins");
        error.messageToClient = "unable to fetch subadmins";
        return next(error);
    }
});
exports.getAllSubAdmins = getAllSubAdmins;
const getAllRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield (0, restaurantdbqueries_1.getRestaurants)();
        res.send(resData);
    }
    catch (e) {
        const error = new Error("not able to fetch restaurants");
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
        const error = new Error("unable to fetch dishes");
        error.messageToClient = "unable to fetch dishes";
        return next(error);
    }
});
exports.getAllDishes = getAllDishes;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = 0;
    const limit = 10;
    try {
        const userData = yield (0, userdbqueries_1.getAllUser)(offset, limit);
        res.send(userData);
    }
    catch (e) {
        const error = new Error("unable to fetch users");
        error.messageToClient = "unable to fetch users";
        return next(error);
    }
});
exports.getAllUsers = getAllUsers;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ssid = req.user.ssid;
    try {
        yield (0, sessiondbqueries_1.endSession)(ssid);
        res.send("you are successfully logged out");
    }
    catch (e) {
        const error = new Error("unable to logout");
        error.messageToClient = "something went wrong";
        return next(error);
    }
});
exports.logout = logout;
