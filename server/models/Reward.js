import mongoose from "mongoose";
import Counter from "./Counter.js";

const rewardSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    amount: { type: Number, required: true },
    desc: { type: String, required: true },
    subdesc: { type: String, required: true },
    delivery: { type: String, required: true },
    shipping: { type: String, required: true },
    num_backers: { type: Number, required: true, default: 0 },
    project_id: { type: Number, required: true, index: true }
  },
  { timestamps: true }
);

rewardSchema.pre("validate", async function prepareReward(next) {
  if (!this.id) this.id = await Counter.next("rewards");
  next();
});

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
