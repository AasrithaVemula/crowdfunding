import express from "express";
import { requireAdmin, requireSignedIn } from "../middleware/auth.js";
import Backing from "../models/Backing.js";
import Project from "../models/Project.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

const deleteProjectCascade = async projectId => {
  await Promise.all([
    Backing.deleteMany({ project_id: projectId }),
    Reward.deleteMany({ project_id: projectId }),
    Project.deleteOne({ id: projectId })
  ]);
};

router.use(requireSignedIn, requireAdmin);

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const [totalUsers, totalProjects, totalRewards, totalBackings] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Reward.countDocuments(),
      Backing.countDocuments()
    ]);

    res.json({ totalUsers, totalProjects, totalRewards, totalBackings });
  })
);

router.get(
  "/projects",
  asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1, id: -1 });

    const items = await Promise.all(
      projects.map(async project => {
        const [owner, rewardCount, backingCount] = await Promise.all([
          User.findOne({ id: project.user_id }),
          Reward.countDocuments({ project_id: project.id }),
          Backing.countDocuments({ project_id: project.id })
        ]);

        return {
          id: project.id,
          title: project.title,
          sub_title: project.sub_title,
          user_id: project.user_id,
          ownerName: owner?.name || "Unknown",
          goal_amount: project.goal_amount,
          total_pledged: project.total_pledged,
          loved: project.loved,
          rewardCount,
          backingCount,
          createdAt: project.createdAt
        };
      })
    );

    res.json(items);
  })
);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1, id: -1 });

    const items = await Promise.all(
      users.map(async user => {
        const [projectCount, backingCount] = await Promise.all([
          Project.countDocuments({ user_id: user.id }),
          Backing.countDocuments({ user_id: user.id })
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: Boolean(user.isAdmin),
          projectCount,
          backingCount,
          createdAt: user.createdAt
        };
      })
    );

    res.json(items);
  })
);

router.delete(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const projectId = Number(req.params.id);
    const project = await Project.findOne({ id: projectId });
    if (!project) return res.status(404).json(["Project not found."]);

    await deleteProjectCascade(projectId);
    res.json({ id: projectId });
  })
);

router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json(["User not found."]);

    if (user.id === req.currentUser.id) {
      return res.status(422).json(["You cannot delete your own admin account."]);
    }

    if (user.isAdmin) {
      return res.status(422).json(["Admin users cannot be deleted from the dashboard."]);
    }

    const userProjects = await Project.find({ user_id: user.id }).select("id");
    await Promise.all(userProjects.map(project => deleteProjectCascade(project.id)));

    await Backing.deleteMany({ user_id: user.id });
    await User.deleteOne({ id: user.id });

    res.json({ id: user.id });
  })
);

export default router;