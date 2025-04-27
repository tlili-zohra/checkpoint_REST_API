// server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
// Import the User model
const User = require("./models/user");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Define routes

// Route 1: GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

// Route 2: POST a new user
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  const newUser = new User({
    name,
    email,
    age,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    console.log(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

// Route 3: PUT - Edit a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
    console.log(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

// Route 4: DELETE a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: "User deleted" });
      console.log("User deleted");
    } else {
      res.status(404).json({ message: "User not found" });
      console.log("User not found");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err.message);
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
