import mongoose from "mongoose";
import Counter from "./Counter.js";

const backingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    user_id: { type: Number, required: true, index: true },
    reward_id: { type: Number, required: true, index: true },
    project_id: { type: Number, required: true, index: true },
    backing_amount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

backingSchema.pre("validate", async function prepareBacking(next) {
  if (!this.id) this.id = await Counter.next("backings");
  next();
});

const Backing = mongoose.model("Backing", backingSchema);

export default Backing;
