import { Router } from "express";
import { getSignup, getLogin, postSignup, postLogin } from "../controllers/authControllers";

const router = Router();

router.get("/signup", getSignup);

router.get("/login", getLogin)

router.post("/signup", postSignup)

router.post("/login", postLogin)
 
export default router