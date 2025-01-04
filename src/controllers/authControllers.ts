import { Request, Response } from "express";
import User from "../models/User";
import validator from "validator";
import bcrypt from "bcrypt";

const getSignup = (req: Request, res: Response) => {
  res.status(200).render("signup");
};

const getLogin = (req: Request, res: Response) => {
  res.status(200).render("login");
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

  return res.status(200).json(user);
};

export { getSignup, getLogin, postSignup, postLogin };
