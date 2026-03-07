import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(" MongoDB connected for seeding");
};

const users = [
  {
    username: "JohnDoe",
    email: "john@example.com",
    password: "Password123",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=FF0000&color=fff&size=200",
  },
  {
    username: "JaneSmith",
    email: "jane@example.com",
    password: "Password123",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=0077FF&color=fff&size=200",
  },
  {
    username: "DevGuru",
    email: "devguru@example.com",
    password: "Password123",
    avatar: "https://ui-avatars.com/api/?name=Dev+Guru&background=00AA44&color=fff&size=200",
  },
];

const channelsData = [
  {
    channelName: "Code with John",
    description: "Coding tutorials and tech reviews by John Doe. Learn React, Node.js and more!",
    channelBanner: "https://picsum.photos/seed/banner1/1280/320",
    channelAvatar: "https://ui-avatars.com/api/?name=Code+John&background=FF0000&color=fff&size=200",
    subscribers: 5200,
    ownerIndex: 0,
  },
  {
    channelName: "Jane Teaches Tech",
    description: "Full-stack development tutorials for beginners and pros.",
    channelBanner: "https://picsum.photos/seed/banner2/1280/320",
    channelAvatar: "https://ui-avatars.com/api/?name=Jane+Tech&background=0077FF&color=fff&size=200",
    subscribers: 3100,
    ownerIndex: 1,
  },
  {
    channelName: "DevGuru Channel",
    description: "Deep dives into software engineering, system design, and data structures.",
    channelBanner: "https://picsum.photos/seed/banner3/1280/320",
    channelAvatar: "https://ui-avatars.com/api/?name=Dev+Guru&background=00AA44&color=fff&size=200",
    subscribers: 12000,
    ownerIndex: 2,
  },
];

const videosData = [
  {
    title: "Learn React in 30 Minutes",
    description: "A quick tutorial to get you started with React. Covers components, state, props, and hooks. Perfect for beginners!",
    thumbnailUrl: "https://picsum.photos/seed/react30/640/360",
    videoUrl: "https://youtu.be/-4e3ewcTupM",
    category: "React",
    views: 15200,
    duration: "30:00",
    channelIndex: 0,
    uploaderIndex: 0,
  },
  {
    title: "Node.js & Express Full Course",
    description: "Complete guide to building REST APIs with Node.js and Express. Covers routing, middleware, authentication and more.",
    thumbnailUrl: "https://picsum.photos/seed/nodejs/640/360",
    videoUrl: "https://youtu.be/D_-p6HHJ2DE",
    category: "Server",
    views: 28400,
    duration: "2:15:00",
    channelIndex: 0,
    uploaderIndex: 0,
  },
  {
    title: "JavaScript ES6+ Features Explained",
    description: "Explore all the modern JavaScript features: arrow functions, destructuring, async/await, optional chaining, and more.",
    thumbnailUrl: "https://i.ytimg.com/an_webp/-4e3ewcTupM/mqdefault_6s.webp?du=3000&sqp=CLOlrM0G&rs=AOn4CLDlX41Lb2GmI1YoxBKv9fGFVBJlSw",
    videoUrl: "https://youtu.be/-4e3ewcTupM",
    category: "JavaScript",
    views: 19500,
    duration: "45:00",
    channelIndex: 1,
    uploaderIndex: 1,
  },
  {
    title: "MongoDB Full Tutorial for Beginners",
    description: "Learn MongoDB from scratch. Collections, documents, CRUD operations, aggregation pipelines and Atlas setup.",
    thumbnailUrl: "https://picsum.photos/seed/mongodb/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Web Development",
    views: 11300,
    duration: "1:20:00",
    channelIndex: 1,
    uploaderIndex: 1,
  },
  {
    title: "Data Structures & Algorithms in JavaScript",
    description: "Master arrays, linked lists, trees, graphs, sorting, and searching algorithms with JavaScript examples.",
    thumbnailUrl: "https://picsum.photos/seed/dsa/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Data Structures",
    views: 34700,
    duration: "3:00:00",
    channelIndex: 2,
    uploaderIndex: 2,
  },
  {
    title: "System Design Interview Prep",
    description: "How to approach system design interviews. Design YouTube, Twitter, WhatsApp and more with real-world examples.",
    thumbnailUrl: "https://picsum.photos/seed/sysdesign/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Information Technology",
    views: 45000,
    duration: "1:45:00",
    channelIndex: 2,
    uploaderIndex: 2,
  },
  {
    title: "Python for Machine Learning - Complete Course",
    description: "From Python basics to machine learning with scikit-learn, pandas, numpy, and matplotlib.",
    thumbnailUrl: "https://picsum.photos/seed/mlpython/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Machine Learning",
    views: 62100,
    duration: "4:30:00",
    channelIndex: 2,
    uploaderIndex: 2,
  },
  {
    title: "React Redux Toolkit Complete Guide",
    description: "State management in React apps using Redux Toolkit. Covers slices, thunks, RTK Query and best practices.",
    thumbnailUrl: "https://picsum.photos/seed/redux/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "React",
    views: 17800,
    duration: "1:10:00",
    channelIndex: 0,
    uploaderIndex: 0,
  },
  {
    title: "Lofi Music for Coding - 2 Hour Mix",
    description: "Relaxing lofi hip hop beats to code and study to. Perfect background music for programming sessions.",
    thumbnailUrl: "https://picsum.photos/seed/lofi/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Music",
    views: 98700,
    duration: "2:00:00",
    channelIndex: 1,
    uploaderIndex: 1,
  },
  {
    title: "Spring Boot REST API Tutorial",
    description: "Build production-ready REST APIs with Spring Boot, Spring Data JPA, and MySQL in this comprehensive guide.",
    thumbnailUrl: "https://picsum.photos/seed/spring/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Spring Framework",
    views: 22100,
    duration: "2:00:00",
    channelIndex: 2,
    uploaderIndex: 2,
  },
  {
    title: "CSS Grid & Flexbox Crash Course",
    description: "Master modern CSS layouts with Grid and Flexbox. Build responsive designs from scratch.",
    thumbnailUrl: "https://picsum.photos/seed/cssgrid/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Web Development",
    views: 14400,
    duration: "55:00",
    channelIndex: 0,
    uploaderIndex: 0,
  },
  {
    title: "Gaming Setup Tour 2024",
    description: "Check out my ultimate gaming and streaming setup! RTX 4090, 4K monitors, and all the peripherals.",
    thumbnailUrl: "https://picsum.photos/seed/gaming/640/360",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Gaming",
    views: 31200,
    duration: "18:00",
    channelIndex: 1,
    uploaderIndex: 1,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});

    console.log(" Cleared existing data");

    // Seed users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(` Created ${createdUsers.length} users`);

    // Seed channels
    const createdChannels = [];
    for (const channelData of channelsData) {
      const { ownerIndex, ...rest } = channelData;
      const channel = await Channel.create({
        ...rest,
        owner: createdUsers[ownerIndex]._id,
      });
      // Link channel to user
      await User.findByIdAndUpdate(createdUsers[ownerIndex]._id, {
        $push: { channels: channel._id },
      });
      createdChannels.push(channel);
    }
    console.log(` Created ${createdChannels.length} channels`);

    // Seed videos
    const createdVideos = [];
    for (const videoData of videosData) {
      const { channelIndex, uploaderIndex, ...rest } = videoData;
      const video = await Video.create({
        ...rest,
        channelId: createdChannels[channelIndex]._id,
        uploader: createdUsers[uploaderIndex]._id,
        comments: [
          {
            userId: createdUsers[(uploaderIndex + 1) % 3]._id,
            text: "Great video! Very helpful and well explained. Thanks for sharing!",
          },
          {
            userId: createdUsers[(uploaderIndex + 2) % 3]._id,
            text: "I have been looking for this kind of tutorial for a long time. Subscribed!",
          },
        ],
      });

      // Link video to channel
      await Channel.findByIdAndUpdate(createdChannels[channelIndex]._id, {
        $push: { videos: video._id },
      });

      createdVideos.push(video);
    }
    console.log(` Created ${createdVideos.length} videos`);

    console.log("\n Database seeded successfully!");
    console.log("\n Test Credentials:");
    console.log("   Email: john@example.com    | Password: Password123");
    console.log("   Email: jane@example.com    | Password: Password123");
    console.log("   Email: devguru@example.com | Password: Password123");

    process.exit(0);
  } catch (error) {
    console.error(" Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();