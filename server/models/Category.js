import mongoose from "mongoose";
import Counter from "./Counter.js";

const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    category_name: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", async function prepareCategory(next) {
  if (!this.id) this.id = await Counter.next("categories");
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
