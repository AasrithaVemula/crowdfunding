import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Counter from "./Counter.js";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    passwordDigest: { type: String, required: true },
    sessionToken: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.virtual("password").set(function setPassword(password) {
  this._password = password;
});

userSchema.pre("validate", async function prepareUser(next) {
  if (!this.id) this.id = await Counter.next("users");
  if (!this.sessionToken) this.sessionToken = randomUUID();

  if (this._password) {
    if (this._password.length < 6) {
      this.invalidate("password", "Password is too short (minimum is 6 characters)");
    } else {
      this.passwordDigest = await bcrypt.hash(this._password, 12);
    }
  }

  next();
});

userSchema.methods.isPassword = function isPassword(password) {
  return bcrypt.compare(password, this.passwordDigest);
};

userSchema.methods.resetSessionToken = async function resetSessionToken() {
  this.sessionToken = randomUUID();
  await this.save();
  return this.sessionToken;
};

userSchema.statics.findByCredentials = async function findByCredentials(email, password) {
  const user = await this.findOne({ email: String(email || "").toLowerCase() });
  if (!user) return null;

  const validPassword = await user.isPassword(password || "");
  return validPassword ? user : null;
};

const User = mongoose.model("User", userSchema);

export default User;
