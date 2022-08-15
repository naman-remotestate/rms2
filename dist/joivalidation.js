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
exports.validateAddMember = exports.validateAddDish = exports.validateAddRestaurant = exports.validateLoginDetails = exports.validateRegisterDetails = exports.validateAddress = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addressSchema = joi_1.default.object({
        address: joi_1.default.string().required().min(4),
        user_location: joi_1.default.required()
    });
    const { error } = addressSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateAddress = validateAddress;
const validateRegisterDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const registerSchema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.required(),
        username: joi_1.default.string().min(3).max(30).required(),
        mobile_no: joi_1.default.string().min(10).max(10)
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateRegisterDetails = validateRegisterDetails;
const validateLoginDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginSchema = joi_1.default.object({
        email: joi_1.default.string().email(),
        password: joi_1.default.required(),
        username: joi_1.default.string().min(3).max(30).required()
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateLoginDetails = validateLoginDetails;
const validateAddRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addRestSchema = joi_1.default.object({
        res_name: joi_1.default.string().required(),
        res_location: joi_1.default.string().required(),
        address: joi_1.default.string().min(5).max(50).required()
    });
    const { error } = addRestSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateAddRestaurant = validateAddRestaurant;
const validateAddDish = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addDishSchema = joi_1.default.object({
        dish: joi_1.default.string().min(5).max(30).required()
    });
    const { error } = addDishSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateAddDish = validateAddDish;
const validateAddMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const registerSchema = joi_1.default.object({
        email: joi_1.default.string().email(),
        password: joi_1.default.required(),
        username: joi_1.default.string().min(3).max(30).required(),
        mobile_no: joi_1.default.string().min(10).max(10)
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const err = new Error(error.message);
        err.statusCode = 400;
        err.clientMessage = error.details[0].message;
        return next(err);
    }
    next();
});
exports.validateAddMember = validateAddMember;
