"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchena = new mongoose_1.Schema({
    email: String,
    password: String,
});
const User = (0, mongoose_1.model)("User", userSchena);
exports.default = User;
