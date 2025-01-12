import { Router } from "express";
import {
  getSignup,
  getLogin,
  postSignup,
  postLogin,
  getLogout,
  postUpdateProfile
} from "../controllers/authControllers";

const router = Router();

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post("/signup", postSignup);

router.post("/login", postLogin);

router.get("/logout", getLogout);

router.post("/update-profile", postUpdateProfile)

export default router;
