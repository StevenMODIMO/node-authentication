import { Router } from "express";
import {
  getSignup,
  getLogin,
  postSignup,
  postLogin,
  getLogout
} from "../controllers/authControllers";

const router = Router();

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post("/signup", postSignup);

router.post("/login", postLogin);

router.get("/logout", getLogout);

export default router;
