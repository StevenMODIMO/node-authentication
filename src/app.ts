import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import path from "path";
import cookieParser from "cookie-parser";
import { requireAuth, checkUser } from "./middleware/requireAuth";

dotenv.config();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use(cookieParser());

app.use("*", checkUser);

app.use(authRoutes);

app.get("/", (req, res) => {
  res.status(200).render("home", { title: "Jwt" });
});

app.get("/user", requireAuth, (req, res) => {
  res.status(200).render("user", { title: "Profile" });
});

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
