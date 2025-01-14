import { Router } from "express";
import {
  getSignup,
  getLogin,
  postSignup,
  postLogin,
  getLogout,
  postUpdateProfile,
  deleteAccount
} from "../controllers/authControllers";
import multer from "multer";

const storage = multer.memoryStorage()

const upload = multer({ storage });

const router = Router();

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post("/signup", postSignup);

router.post("/login", postLogin);

router.get("/logout", getLogout);

router.post(
  "/update-profile",
  upload.single("profileImage"),
  postUpdateProfile
);

router.delete("/delete-account", deleteAccount)

export default router;
