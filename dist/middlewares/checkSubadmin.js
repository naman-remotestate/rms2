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
exports.isSubAdmin = void 0;
const rolesdbqueries_1 = require("../helpers/rolesdbqueries");
const isSubAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    try {
        const resFromDb = yield (0, rolesdbqueries_1.searchRole)(userId, 'subadmin');
        if (!resFromDb)
            res.send("you can't perform this action");
        else
            next();
    }
    catch (e) {
        console.log(e);
    }
});
exports.isSubAdmin = isSubAdmin;
