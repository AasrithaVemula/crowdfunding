import Backing from "../models/Backing.js";
import Category from "../models/Category.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";

export const keyById = records =>
  records.reduce((acc, record) => {
    acc[record.id] = record;
    return acc;
  }, {});

export const serializeUser = user => ({
  id: user.id,
  email: user.email,
  name: user.name,
  isAdmin: Boolean(user.isAdmin)
});

export const serializeReward = async reward => {
  const backingCount = await Backing.countDocuments({ reward_id: reward.id });

  return {
    id: reward.id,
    amount: reward.amount,
    desc: reward.desc,
    subdesc: reward.subdesc,
    delivery: reward.delivery,
    shipping: reward.shipping,
    num_backers: reward.num_backers,
    project_id: reward.project_id,
    newRewardBackers: reward.num_backers + backingCount
  };
};

export const serializeProject = async project => {
  const [category, user, rewards, backings] = await Promise.all([
    Category.findOne({ id: project.category_id }),
    User.findOne({ id: project.user_id }),
    Reward.find({ project_id: project.id }),
    Backing.find({ project_id: project.id })
  ]);

  const rewardTotal = rewards.reduce(
    (sum, reward) => sum + reward.amount * reward.num_backers,
    0
  );
  const backingTotal = backings.reduce(
    (sum, backing) => sum + backing.backing_amount,
    0
  );

  return {
    id: project.id,
    title: project.title,
    sub_title: project.sub_title,
    loved: project.loved,
    total_pledged: project.total_pledged,
    goal_amount: project.goal_amount,
    num_backers: project.num_backers,
    days_left: project.days_left,
    location: project.location,
    campaign: project.campaign,
    about: project.about,
    category_id: project.category_id,
    user_id: project.user_id,
    photoURL: project.photoURL,
    category: category?.category_name || "",
    authorName: user?.name || "",
    newPledgeAmount: rewardTotal + backingTotal,
    newTotalBackers: project.num_backers + backings.length
  };
};

export const serializeProjectShow = async project => {
  const [serializedProject, rewards] = await Promise.all([
    serializeProject(project),
    Reward.find({ project_id: project.id }).sort({ id: 1 })
  ]);

  const serializedRewards = await Promise.all(rewards.map(serializeReward));

  return {
    project: serializedProject,
    rewards: keyById(serializedRewards)
  };
};
