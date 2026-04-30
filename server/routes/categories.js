import express from "express";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import { keyById } from "../utils/formatters.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ id: 1 });
    const serialized = categories.map(category => ({
      id: category.id,
      category_name: category.category_name
    }));

    res.json(keyById(serialized));
  })
);

export default router;
