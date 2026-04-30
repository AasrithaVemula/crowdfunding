import express from "express";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { serializeUser } from "../utils/formatters.js";

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.currentUser) return res.status(404).json(["Nobody is currently signed in"]);
  res.json(serializeUser(req.currentUser));
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const params = req.body.user || {};
    const user = await User.findByCredentials(params.email, params.password);

    if (!user) {
      return res
        .status(401)
        .json(["The email address and password you entered do not match."]);
    }

    await user.resetSessionToken();
    req.session.userId = user.id;
    res.json(serializeUser(user));
  })
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.currentUser) {
      return res.status(404).json(["Nobody is currently signed in"]);
    }

    const user = req.currentUser;
    await user.resetSessionToken();
    req.session.destroy(() => res.json(serializeUser(user)));
  })
);

export default router;
