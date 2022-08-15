"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const admin_1 = __importDefault(require("./routes/admin"));
const subadmin_1 = __importDefault(require("./routes/subadmin"));
const user_1 = __importDefault(require("./routes/user"));
const AppError_1 = require("./AppError");
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/subadmin', subadmin_1.default);
app.use('/user', user_1.default);
app.use(AppError_1.errorHandler);
app.listen(3000, () => {
    console.log("listening on port no 3000!!");
});
