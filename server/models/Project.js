import mongoose from "mongoose";
import Counter from "./Counter.js";

const projectSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true, unique: true, trim: true },
    sub_title: { type: String, required: true },
    total_pledged: { type: Number, required: true, default: 0 },
    goal_amount: { type: Number, required: true },
    num_backers: { type: Number, required: true, default: 0 },
    days_left: { type: Number, required: true },
    loved: { type: Boolean, required: true, default: false },
    location: { type: String, required: true },
    campaign: { type: String, required: true },
    about: { type: String, required: true },
    category_id: { type: Number, required: true, index: true },
    user_id: { type: Number, required: true, index: true },
    photoURL: { type: String, default: "/assets/images/allBirds.png" }
  },
  { timestamps: true }
);

projectSchema.pre("validate", async function prepareProject(next) {
  if (!this.id) this.id = await Counter.next("projects");
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
