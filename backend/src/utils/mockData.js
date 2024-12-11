import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Use your MongoDB URI
const MONGO_URI =
  "mongodb+srv://soumojitbanerjee08:Dxtwevba9lqDC80L@cluster0.zw4mm.mongodb.net/blog-app?retryWrites=true&w=majority&appName=Cluster0";

const DEFAULT_AVATAR = "/uploads/profile-photos/avatar.png";

const generateUsers = async (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    users.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      profilePhoto: DEFAULT_AVATAR, // Set default avatar
      bio: faker.lorem.sentence(),
      links: faker.internet.url(),
    });
  }
  return await User.insertMany(users);
};

const generatePosts = async (num, users) => {
  const posts = [];
  for (let i = 0; i < num; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    posts.push({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      author: randomUser._id,
      createdAt: faker.date.past(),
    });
  }
  return await Post.insertMany(posts);
};

const generateMockData = async () => {
  await mongoose.connect(MONGO_URI);

  const users = await generateUsers(10); // Generate 10 users
  await generatePosts(20, users); // Generate 20 posts

  console.log("Mock data generated successfully!");
  mongoose.connection.close();
};

generateMockData().catch((error) => {
  console.error("Error generating mock data:", error);
  mongoose.connection.close();
});
