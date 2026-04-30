import express from "express";
import Reward from "../models/Reward.js";
import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";
import { requireSignedIn } from "../middleware/auth.js";
import { keyById, serializeReward } from "../utils/formatters.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rewards = await Reward.find().sort({ id: 1 });
    const serializedRewards = await Promise.all(rewards.map(serializeReward));

    res.json(keyById(serializedRewards));
  })
);

router.post(
  "/",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const params = req.body.reward || {};
    const project = await Project.findOne({ id: Number(params.project_id) });
    if (!project) return res.status(404).json(["Project not found."]);

    const reward = new Reward({
      amount: Number(params.amount || 0),
      desc: params.desc,
      subdesc: params.subdesc || "",
      delivery: params.delivery || "Tomorrow",
      shipping: params.shipping || "International",
      num_backers: Number(params.num_backers || 0),
      project_id: project.id
    });

    await reward.save();
    res.status(201).json({ reward: await serializeReward(reward) });
  })
);

router.delete(
  "/:id",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const reward = await Reward.findOneAndDelete({ id: Number(req.params.id) });
    if (!reward) return res.status(404).json(["No reward currently selected."]);

    res.json({ reward: await serializeReward(reward) });
  })
);

export default router;
