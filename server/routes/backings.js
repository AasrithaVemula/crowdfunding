import express from "express";
import Backing from "../models/Backing.js";
import Project from "../models/Project.js";
import Reward from "../models/Reward.js";
import asyncHandler from "../utils/asyncHandler.js";
import { requireSignedIn } from "../middleware/auth.js";
import { serializeProject, serializeReward } from "../utils/formatters.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const backings = await Backing.find().sort({ id: 1 });
    res.json(backings);
  })
);

router.post(
  "/",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const params = req.body.backing || {};
    const reward = await Reward.findOne({ id: Number(params.reward_id) });
    if (!reward) return res.status(404).json(["Reward not found."]);

    const project = await Project.findOne({ id: Number(params.project_id || reward.project_id) });
    if (!project) return res.status(404).json(["Project not found."]);

    const backing = new Backing({
      user_id: req.currentUser.id,
      reward_id: reward.id,
      project_id: project.id,
      backing_amount: Number(params.backing_amount || reward.amount)
    });

    await backing.save();

    const rewards = await Reward.find({ project_id: project.id }).sort({ id: 1 });
    const serializedRewards = await Promise.all(rewards.map(serializeReward));

    res.status(201).json({
      backing: {
        id: backing.id,
        user_id: backing.user_id,
        reward_id: backing.reward_id,
        project_id: backing.project_id,
        backing_amount: backing.backing_amount
      },
      project: await serializeProject(project),
      rewards: serializedRewards.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {})
    });
  })
);

export default router;
