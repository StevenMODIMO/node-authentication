"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.get("/signup", authControllers_1.getSignup);
router.get("/login", authControllers_1.getLogin);
router.post("/signup", authControllers_1.postSignup);
router.post("/login", authControllers_1.postLogin);
router.get("/logout", authControllers_1.getLogout);
router.post("/update-profile", upload.single("profileImage"), authControllers_1.postUpdateProfile);
router.delete("/delete-account", authControllers_1.deleteAccount);
exports.default = router;
