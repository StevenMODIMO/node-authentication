import { Router } from "express";
import {
  getSignup,
  getLogin,
  postSignup,
  postLogin,
  getLogout,
  getVerifyEmail,
  postVerifyEmail,
  getResetPassword,
} from "../controllers/authControllers";

const router = Router();

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post("/signup", postSignup);

router.post("/login", postLogin);

router.get("/logout", getLogout);

router.get("/verify-email", getVerifyEmail);

router.post("/verify", postVerifyEmail);

router.get("/reset-password", getResetPassword);

export default router;
