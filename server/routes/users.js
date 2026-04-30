import express from "express";
import { randomUUID } from "node:crypto";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { serializeUser } from "../utils/formatters.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const params = req.body.user || {};
    const user = new User({
      email: params.email,
      name: params.name,
      password: params.password,
      sessionToken: randomUUID()
    });

    await user.save();
    await user.resetSessionToken();
    req.session.userId = user.id;

    res.status(201).json(serializeUser(user));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ id: Number(req.params.id) });
    if (!user) return res.status(404).json(["User not found."]);

    res.json(serializeUser(user));
  })
);

export default router;
