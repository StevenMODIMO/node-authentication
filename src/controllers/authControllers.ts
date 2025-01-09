import { Request, Response } from "express";
import User from "../models/User";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: maxAge,
  });
};

const getSignup = (req: Request, res: Response) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/user");
  } else {
    res.status(200).render("signup", { title: "Get started" });
  }
};

const getLogin = (req: Request, res: Response) => {
  const user = res.locals.user;
  if (user) {
    res.redirect("/user");
  } else {
    res.status(200).render("login", { title: "Login" });
  }
};

const postSignup = async (req: Request, res: Response) => {
  const { email, password } = await req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields must be filled." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email." });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(200).json({ message: "Weak password: e.g Biko.2022!!." });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "Email in use." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ email, password: hash });
    const token = createToken(newUser._id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

const postLogin = async (req: Request, res: Response) => {
  const { email, password } = await req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields must be filled." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Incorrect email." });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const token = createToken(user._id);
  res.cookie("jwt", token, { maxAge: maxAge * 1000 });

  return res.status(200).json(user);
};

const getLogout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};

const getVerifyEmail = (req: Request, res: Response) => {
  const user = res.locals.user;
  const m = req.query.m;
  let message = "";
  if (m) {
    message = "You need to verify your email first";
  }
  if (user) {
    res.redirect("/user");
  } else {
    res
      .status(200)
      .render("verify-email", { title: "Verify your email", message });
  }
};

const postVerifyEmail = async (req: Request, res: Response) => {
  const { email } = await req.body;

  if (!email) {
    return res.status(400).json({ message: "Email must be filled" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "No account associated with this email" });
  } else {
    res.redirect(`/reset-password?email=${encodeURIComponent(email)}`);
  }
};

const getResetPassword = (req: Request, res: Response) => {
  const email = req.query.email;
  if (!email) {
    res.redirect("/verify-email?m=1");
  } else {
    res
      .status(200)
      .render("reset-password", { title: "Enter you new password" });
  }
};

export {
  getSignup,
  getLogin,
  postSignup,
  postLogin,
  getLogout,
  getVerifyEmail,
  postVerifyEmail,
  getResetPassword,
};
