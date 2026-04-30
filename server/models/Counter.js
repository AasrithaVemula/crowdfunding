import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 }
  },
  { versionKey: false }
);

counterSchema.statics.next = async function next(name) {
  const counter = await this.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return counter.value;
};

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
