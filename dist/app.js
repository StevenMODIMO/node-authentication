"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const requireAuth_1 = require("./middleware/requireAuth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("*", requireAuth_1.checkUser);
app.use(authRoutes_1.default);
app.get("/", (req, res) => {
    res.status(200).render("home", { title: "Node Authentication." });
});
app.get("/user", requireAuth_1.requireAuth, (req, res) => {
    res.status(200).render("user", { title: "Profile" });
});
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:${process.env.PORT}`);
    });
})
    .catch((error) => console.log(error));
