import "dotenv/config";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Backing from "./models/Backing.js";
import Category from "./models/Category.js";
import Counter from "./models/Counter.js";
import Project from "./models/Project.js";
import Reward from "./models/Reward.js";
import User from "./models/User.js";

const categories = [
  "Arts",
  "Comics & Illustration",
  "Design & Tech",
  "Film",
  "Food & Craft",
  "Games",
  "Music",
  "Publishing"
].map((category_name, index) => ({ id: index + 1, category_name }));

const users = [
  ["admin@gmail.com", "admin123", "Admin"],
  ["allBirds@bob.com", "allbirds123", "All Birds"],
  ["nike@bob.com", "nike123", "Nike"],
  ["adidas@bob.com", "adidas123", "Adidas"],
  ["blazer@bob.com", "blazer123", "The Sandlot"],
  ["golf@bob.com", "golf123", "Golf"],
  ["offWhite@bob.com", "offwhite123", "Off-White"],
  ["shoeCreator@bob.com", "shoecreator123", "Alex Ports"],
  ["kickit@bob.com", "kickit123", "Kick It"],
  ["demouser1@demo.com", "demo123", "We Luv Art"],
  ["demouser2@demo.com", "demo123", "SF Art Students"],
  ["demouser3@demo.com", "demo123", "Pablo Picas Co."],
  ["demouser4@demo.com", "demo123", "Draw R US"],
  ["demouser5@demo.com", "demo123", "Stencil It"],
  ["demouser6@demo.com", "demo123", "Pencil N Pen"],
  ["demouser7@demo.com", "demo123", "Scrum"],
  ["demouser8@demo.com", "demo123", "The UX Experience"],
  ["demouser9@demo.com", "demo123", "2 Week Sprint"],
  ["demouser10@demo.com", "demo123", "Artsy Film Guys"],
  ["demouser11@demo.com", "demo123", "Film Isn't Dead"],
  ["demouser12@demo.com", "demo123", "Movie Pass"],
  ["demouser13@demo.com", "demo123", "Flavor Town"],
  ["demouser14@demo.com", "demo123", "NomNom"],
  ["demouser15@demo.com", "demo123", "Let's Build Fam"],
  ["demouser16@demo.com", "demo123", "Twitchy"],
  ["demouser17@demo.com", "demo123", "500GB of RAM"],
  ["demouser18@demo.com", "demo123", "GTX 9000"],
  ["demouser19@demo.com", "demo123", "The Old Kanye"],
  ["demouser20@demo.com", "demo123", "Feel Like Kobe"],
  ["demouser21@demo.com", "demo123", "Ultralight"],
  ["demouser23@demo.com", "demo123", "Old Times"],
  ["demouser24@demo.com", "demo123", "Audioless Books"],
  ["demouser25@demo.com", "demo123", "Need My Readers"]
].map(([email, password, name], index) => ({
  id: index + 1,
  email,
  password,
  name,
  isAdmin: index === 0,
  sessionToken: randomUUID()
}));

const campaign =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const projects = [
  ["We Draw It!", "Give us a pen, two weeks, and a shoe. We'll send you a custom drawing back.", 1, 11, "allBirds.png"],
  ["Nike: The Art Collection", "An iconic brand with even more iconic art. Just Do It. Summer 2020.", 2, 3, "nike.jpeg"],
  ["AirMag", "No more laces. Just style.", 3, 18, "adidas.jpeg"],
  ["Run Faster, Jump Higher", "Like it's 1993 all over again.", 4, 5, "blazer.jpg"],
  ["GOLF", "Help Tyler, the Creator launch his new Fall/Winter line.", 7, 6, "golf.jpg"],
  ["Modern Shoefare", "The most shoe-centric Call of Duty yet. Watch your Jordan 6, solider.", 6, 25, "offwhite.jpg"],
  ["Crafty", "Nobody likes generic clothing. Learn how to make your own with Crafty.", 5, 8, "shoecreator.jpg"],
  ["Can I Kick It?", "Yes, you can. The newest app for buying, selling, and trading sneakers.", 8, 9, "featured.jpg"],
  ["All the Colors", "We love our sneakers. And so will you.", 1, 10, "retro.png"],
  ["Struttin", "Walk on down. Let's make dreams a reality.", 1, 11, "allBirds.png"],
  ["Comics for Your Feet", "Our goal is to let you live out your childhood, forever.", 1, 12, "nike.jpeg"],
  ["Just Another Art Project", "Exit through the gift shop, please.", 1, 10, "adidas.jpeg"],
  ["Neon Dreams", "We brighten up your day with your favorite sneakers, literally.", 1, 11, "offwhite.jpg"],
  ["Wall Hangers", "Put something up in your apartment that even your Mom will be proud of.", 1, 12, "shoecreator.jpg"],
  ["All Birds", "Our first shoe was the Wool Runner, made from superfine merino wool.", 1, 2, "allBirds.png"],
  ["Sneaker Sketch", "Design your own sneakers, all from your tablet.", 2, 13, "nike.jpeg"],
  ["Prototypal Inheritance", "No need for a designer anymore. Do it all yourself.", 2, 14, "adidas.jpeg"],
  ["Between The Lines", "A new sketch book built for all ages.", 2, 15, "retro.png"],
  ["Crazy Ideas", "Illustrated shoes for people with louder imaginations.", 2, 13, "offwhite.jpg"],
  ["1 Shoe, 2 Shoe", "A playful comic collection for sneakerheads.", 2, 14, "golf.jpg"],
  ["Two Brothers", "A family illustrated sneaker studio.", 2, 15, "shoecreator.jpg"],
  ["Sneaker Papers", "Illustration prints, zines, and sneaker stories.", 2, 13, "featured.jpg"],
  ["YourID", "A customization platform for the perfect fit.", 3, 16, "adidas.jpeg"],
  ["Glow Up", "Smart lighting for your favorite pairs.", 3, 17, "offwhite.jpg"],
  ["Adidas", "A classic brand exploring a new creator-powered drop.", 3, 4, "adidas.jpeg"],
  ["RunTrackR", "Track your runs and your soles.", 3, 18, "golf.jpg"],
  ["Back Nine", "Golf footwear with better data.", 3, 16, "shoecreator.jpg"],
  ["Shoe App", "A clean way to catalog, swap, and discover shoes.", 3, 17, "featured.jpg"],
  ["Blocked", "A design system for modular sneaker building.", 3, 18, "allBirds.png"],
  ["Jump", "A short film about the shoes we carry through life.", 4, 19, "blazer.jpg"],
  ["Gump", "Run across the country in cinema history.", 4, 20, "featured.jpg"],
  ["Back to the Future VR", "Step into the future of shoe storytelling.", 4, 21, "retro.png"],
  ["Her", "A quiet film about a person and their perfect pair.", 4, 19, "nike.jpeg"],
  ["Forrest", "A documentary about running memories.", 4, 20, "golf.jpg"],
  ["The 90s", "A nostalgic sneaker film project.", 4, 21, "blazer.jpg"],
  ["Ballin", "A basketball film made by sneaker lovers.", 4, 19, "offwhite.jpg"],
  ["Yarn", "Craft soft accessories for hard-working shoes.", 5, 22, "shoecreator.jpg"],
  ["Pete Zah", "Pizza-themed sneaker care kits.", 5, 23, "featured.jpg"],
  ["Nom Nom Nom", "Food culture meets footwear culture.", 5, 24, "retro.png"],
  ["Treats and Sweets", "Dessert colors for your closet.", 5, 22, "allBirds.png"],
  ["Sneaker Supply Co.", "A maker kit for restoring beloved pairs.", 5, 23, "adidas.jpeg"],
  ["Built To Last", "Durable tools for custom sneaker work.", 5, 24, "shoecreator.jpg"],
  ["Tools Etc.", "Everything you need for the workbench.", 5, 22, "nike.jpeg"],
  ["More Colors", "A sneaker-themed game of collection and strategy.", 6, 25, "retro.png"],
  ["TRON Runner", "A neon racing game for future footwear.", 6, 26, "offwhite.jpg"],
  ["Up Down Punch Kick", "Arcade action inspired by streetwear.", 6, 27, "golf.jpg"],
  ["Off-White", "A concept drop for experimental sneakers.", 6, 7, "offwhite.jpg"],
  ["2K Kicks", "A sports game for shoe collectors.", 6, 25, "featured.jpg"],
  ["Miami Vice 2020", "A synth-soaked runner with custom kicks.", 6, 26, "blazer.jpg"],
  ["Active Gaming Footwear", "Comfort-first gear for marathon gaming.", 6, 27, "allBirds.png"],
  ["Sunshine in a Bag", "A music project packaged with limited sneakers.", 7, 28, "golf.jpg"],
  ["Notified", "A release-alert album and companion app.", 7, 29, "featured.jpg"],
  ["Red October", "A tribute record for an iconic silhouette.", 7, 30, "offwhite.jpg"],
  ["Cold World", "A winter EP for warm fits.", 7, 28, "nike.jpeg"],
  ["Fire Pt. 2", "A follow-up album with custom artwork.", 7, 29, "retro.png"],
  ["I Miss the Old Kanye", "A sneaker culture mixtape.", 7, 30, "adidas.jpeg"],
  ["New Fashion", "Fresh sounds for fresh footwear.", 7, 28, "shoecreator.jpg"],
  ["Shoe Times", "A monthly printed sneaker journal.", 8, 31, "featured.jpg"],
  ["Print is Alive", "A tactile magazine for footwear design.", 8, 32, "retro.png"],
  ["Shoes Master", "A collector book with rare stories.", 8, 33, "nike.jpeg"],
  ["The Ultimate Sneaker Book!", "A large-format guide to sneaker history.", 8, 31, "allBirds.png"],
  ["GP Shoes", "A motorsport-inspired publishing project.", 8, 32, "golf.jpg"],
  ["Air Maxed Out", "A book about visible air and visible culture.", 8, 33, "adidas.jpeg"],
  ["The Dunk Book", "A publishing project for fans of the Dunk.", 8, 31, "offwhite.jpg"]
].map(([title, sub_title, category_id, user_id, image], index) => ({
  id: index + 1,
  title,
  sub_title,
  total_pledged: index < 8 ? 123 + index * 37 : index * 23,
  goal_amount: 5000 + index * 500,
  num_backers: index % 4,
  days_left: 2 + (index % 50),
  loved: index < 8 || index % 5 === 0,
  location: "the United States",
  campaign,
  about: "This is a company profile with some info.",
  category_id,
  user_id,
  photoURL: `/assets/images/${image}`
}));

const rewardTemplates = [
  [10, "KickitReward1", "test test test test test", 10],
  [20, "Just a Small Reward", "Don't expect much.", 22],
  [50, "A Slightly Larger Reward", "Probably pretty worth the dough!", 12],
  [100, "Big Spender", "Now we're talking!", 12]
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    Backing.deleteMany({}),
    Reward.deleteMany({}),
    Project.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
    Counter.deleteMany({})
  ]);

  for (const user of users) {
    await User.create(user);
  }

  await Category.insertMany(categories);
  await Project.insertMany(projects);

  const rewards = projects.flatMap(project =>
    rewardTemplates.map(([amount, desc, subdesc, num_backers], index) => ({
      id: (project.id - 1) * rewardTemplates.length + index + 1,
      amount,
      desc,
      subdesc,
      delivery: "Tomorrow",
      shipping: "International",
      num_backers,
      project_id: project.id
    }))
  );

  await Reward.insertMany(rewards);

  await Counter.insertMany([
    { name: "users", value: users.length },
    { name: "categories", value: categories.length },
    { name: "projects", value: projects.length },
    { name: "rewards", value: rewards.length },
    { name: "backings", value: 0 }
  ]);

  console.log(`Seeded ${users.length} users, ${projects.length} projects, and ${rewards.length} rewards.`);
  await mongoose.connection.close();
};

seed().catch(async error => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
