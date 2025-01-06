import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

interface JWTCALLBACKPROPS {
  err: string;
  encodedToken: string;
}

dotenv.config();

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: jwt.VerifyErrors | null, encoded: any) => {
        if (err) {
          console.log(err);
          res.redirect("/login");
        } else {
          console.log(encoded);
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err: jwt.VerifyErrors | null, encoded: any) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          const user = await User.findOne({ _id: encoded.id });
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

export { requireAuth, checkUser };
