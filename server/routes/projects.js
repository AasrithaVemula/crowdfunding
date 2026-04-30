import express from "express";
import Project from "../models/Project.js";
import Reward from "../models/Reward.js";
import Backing from "../models/Backing.js";
import asyncHandler from "../utils/asyncHandler.js";
import { requireSignedIn } from "../middleware/auth.js";
import { keyById, serializeProject, serializeProjectShow } from "../utils/formatters.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ id: 1 });
    const serializedProjects = await Promise.all(projects.map(serializeProject));

    res.json(keyById(serializedProjects));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const project = await Project.findOne({ id: Number(req.params.id) });
    if (!project) return res.status(404).json(["Project not found."]);

    res.json(await serializeProjectShow(project));
  })
);

router.post(
  "/",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const params = req.body.project || {};
    const project = new Project({
      title: params.title,
      sub_title: params.sub_title,
      total_pledged: Number(params.total_pledged || 0),
      goal_amount: Number(params.goal_amount || 1),
      num_backers: Number(params.num_backers || 0),
      days_left: Number(params.days_left || 30),
      loved: Boolean(params.loved),
      location: params.location || "Worldwide",
      campaign: params.campaign || "Campaign should go here... Please edit me!",
      about: params.about || "This is a company. They have yet to fill out their bio!",
      category_id: Number(params.category_id || 1),
      user_id: req.currentUser.id,
      photoURL: params.photoURL || "/assets/images/allBirds.png"
    });

    await project.save();
    res.status(201).json(await serializeProjectShow(project));
  })
);

router.patch(
  "/:id",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const project = await Project.findOne({ id: Number(req.params.id) });
    if (!project) return res.status(404).json(["Project not found."]);
    if (project.user_id !== req.currentUser.id) {
      return res.status(403).json(["You can only update your own projects."]);
    }

    Object.assign(project, req.body.project || {});
    await project.save();
    res.json(await serializeProjectShow(project));
  })
);

router.delete(
  "/:id",
  requireSignedIn,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const project = await Project.findOne({ id });
    if (!project) return res.status(404).json(["Project not found."]);
    if (project.user_id !== req.currentUser.id) {
      return res.status(403).json(["You can only delete your own projects."]);
    }

    await Promise.all([
      Project.deleteOne({ id }),
      Reward.deleteMany({ project_id: id }),
      Backing.deleteMany({ project_id: id })
    ]);

    res.json(id);
  })
);

export default router;
