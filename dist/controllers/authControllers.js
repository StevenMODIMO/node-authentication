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
exports.deleteAccount = exports.postUpdateProfile = exports.getLogout = exports.postLogin = exports.postSignup = exports.getLogin = exports.getSignup = void 0;
const User_1 = __importDefault(require("../models/User"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const blob_1 = require("@vercel/blob");
dotenv_1.default.config();
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};
const getSignup = (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/user");
    }
    else {
        res.status(200).render("signup", { title: "Get started" });
    }
};
exports.getSignup = getSignup;
const getLogin = (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/user");
    }
    else {
        res.status(200).render("login", { title: "Login" });
    }
};
exports.getLogin = getLogin;
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields must be filled." });
    }
    if (!validator_1.default.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email." });
    }
    if (!validator_1.default.isStrongPassword(password)) {
        return res.status(200).json({ message: "Weak password: e.g Biko.2022!!." });
    }
    const user = yield User_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Email in use." });
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield User_1.default.create({ email, password: hash });
        const token = createToken(newUser._id);
        res.cookie("jwt", token, { maxAge: maxAge * 1000 });
        res.status(200).json(newUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.postSignup = postSignup;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields must be filled." });
    }
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Incorrect email." });
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Incorrect password." });
    }
    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    return res.status(200).json(user);
});
exports.postLogin = postLogin;
const getLogout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/login");
};
exports.getLogout = getLogout;
const postUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profileImage = req.file;
    const { user } = res.locals;
    if (!profileImage) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const fileContent = profileImage.buffer;
        const { url } = yield (0, blob_1.put)(`profile-images/${profileImage.originalname}`, fileContent, {
            contentType: profileImage.mimetype,
            access: "public",
        });
        const update = yield User_1.default.findOneAndUpdate({ email: user.email }, { $set: { profileUrl: url } }, { new: true });
        res.status(200).json({
            message: "File uploaded successfully",
            update,
        });
    }
    catch (error) {
        console.error("Error uploading to Vercel Blob:", error);
        res.status(500).json({ message: "Error uploading file", error });
    }
});
exports.postUpdateProfile = postUpdateProfile;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = res.locals;
    try {
        yield User_1.default.findOneAndDelete({ email: user.email });
        res.status(200).json({ message: "Account deleted successfully" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.deleteAccount = deleteAccount;
