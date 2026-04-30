import cors from "cors";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { currentUser } from "./middleware/auth.js";
import adminRouter from "./routes/admin.js";
import backingsRouter from "./routes/backings.js";
import categoriesRouter from "./routes/categories.js";
import projectsRouter from "./routes/projects.js";
import rewardsRouter from "./routes/rewards.js";
import sessionRouter from "./routes/session.js";
import usersRouter from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "kicker.sid",
    secret: process.env.SESSION_SECRET || "replace-this-secret-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);
app.use(currentUser);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/users", usersRouter);
app.use("/api/session", sessionRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/rewards", rewardsRouter);
app.use("/api/backings", backingsRouter);
app.use("/api/admin", adminRouter);

app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(422).json(Object.values(err.errors).map(error => error.message));
  }

  if (err.code === 11000) {
    return res.status(422).json(["This record already exists."]);
  }

  console.error(err);
  res.status(500).json(["Something went wrong."]);
});

export default app;
