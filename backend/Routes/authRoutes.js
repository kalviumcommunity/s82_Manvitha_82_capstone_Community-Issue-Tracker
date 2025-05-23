const express = require('express');
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt');

const authenticateToken = require('../middleware/authMiddleWare');

const authRouter = express.Router();


// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });}


// Signup Route
authRouter.get('/getUser/:id', async (req, res) => {
  try {
    const getUser = await User.findOne({ _id: req.params.id }); 
    if (!getUser) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(getUser);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user", error: e.message });
  }
});




authRouter.post('/signup', async (req, res) => {
  try {

    const { name,mail, password, role } = req.body;


    if (!name||!mail || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ mail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({name, mail, password: hashedPassword, role });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({ message: "Signup successful", token, role: newUser.role });


  } catch (e) {
    res.status(500).json({ message: "Something went wrong", error: e.message });
  }
});

// Login Route
authRouter.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      role: user.role,
      user: {
        id: user._id,
        mail: user.mail,
        name: user.name // if you want to send name too
      }
    });

  } catch (e) {
    res.status(500).json({ message: "Login failed", error: e.message });
  }
});


// Protected: Get All Users
authRouter.get('/getusers', authenticateToken, async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);     
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch users", error: e.message });
  }
});

// Update User
authRouter.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {name, mail, password } = req.body;
    let updatedFields = { mail };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });

  } catch (e) {
    res.status(500).json({ message: "Update failed", error: e.message });
  }
});

// Delete User
authRouter.delete('/deleteUser/:id', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });

  } catch (e) {
    res.status(500).json({ message: "Delete failed", error: e.message });
  }
});

module.exports = authRouter;
