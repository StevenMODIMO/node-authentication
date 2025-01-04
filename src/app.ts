import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import path from "path"

dotenv.config();

// initalize app
const app = express();

app.set('views', path.join(__dirname, 'views')); 
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist', 'public')));
app.use(authRoutes);

app.get("/", (req, res) => {
  res.status(200).render("home");
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