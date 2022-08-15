"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
const joivalidation_1 = require("../joivalidation");
const { authToken } = require('../middlewares/auth');
router.post('/register', joivalidation_1.validateRegisterDetails, user_1.register);
router.post('/login', joivalidation_1.validateLoginDetails, user_1.login);
router.get('/get-all-restaurants', authToken, user_1.getAllRestaurants);
router.get('/:res_id/get-all-dishes', authToken, user_1.getAllDishes);
router.post('/add-address', authToken, joivalidation_1.validateAddress, user_1.addAddress);
router.get('/logout', authToken, user_1.logout);
exports.default = router;
