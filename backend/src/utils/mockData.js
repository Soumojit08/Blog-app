import faker from "faker";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const generateUsers = async (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    users.push({
      fullName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      profilePhoto: faker.image.avatar(),
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
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const users = await generateUsers(10); // Generate 10 users
  await generatePosts(20, users); // Generate 20 posts

  console.log("Mock data generated successfully!");
  mongoose.connection.close();
};

generateMockData().catch((error) => {
  console.error("Error generating mock data:", error);
  mongoose.connection.close();
});
