import User from "../models/User.js";

export const currentUser = async (req, res, next) => {
  if (!req.session?.userId) {
    req.currentUser = null;
    return next();
  }

  req.currentUser = await User.findOne({ id: req.session.userId });
  next();
};

export const requireSignedIn = (req, res, next) => {
  if (!req.currentUser) {
    return res.status(401).json(["You need to be signed in to continue."]);
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.currentUser?.isAdmin) {
    return res.status(403).json(["You do not have permission to perform this action."]);
  }

  next();
};
