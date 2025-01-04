import jsonwebtoken from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default requireAuth;
