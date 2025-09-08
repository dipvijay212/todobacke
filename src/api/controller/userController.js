const bcrypt = require("bcrypt");
const db = require("../../database/index");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    console.log("Incoming data:", name, email);

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // const nameValidation = /^[a-zA-Z ]{2,30}$/;
    // if (!nameValidation.test(name)) {
    //   return res.status(400).json({ message: "Invalid name" });
    // }

    const phoneNumberValidation = /^[0-9]{10}$/;
    if (!phoneNumberValidation.test(phoneNumber)) {
      return res.status(400).json({ message: "Wrong phone number" });
    }

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
      return res.status(422).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const existingUser = await db.users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    let profileImage = null;
    if (req.file) {
      profileImage = req.file.filename;
    }

    const newUser = await db.users.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      phoneNumber,
    });

    console.log("User created:", newUser);
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message }); 
  }
};
const userGetProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.users.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "user got profile successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const trimmedIdentifier = identifier ? identifier.trim() : "";

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    let existingUser;
    const isEmail = /^(?![.-])[a-zA-Z0-9.-]+@(gmail|yahoo|hotmail)\.com(?<![.-])$/.test(trimmedIdentifier);
    const isPhone = /^\d{10}$/.test(trimmedIdentifier);
    const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(trimmedIdentifier);

    if (isEmail) {
      existingUser = await db.users.findOne({ where: { email: trimmedIdentifier } });
    } else if (isPhone) {
      existingUser = await db.users.findOne({ where: { phoneNumber: trimmedIdentifier } });
    } else if (isUsername) {
      existingUser = await db.users.findOne({ where: { name: trimmedIdentifier } });
    } else {
      return res.status(400).json({ message: "Invalid email, phone number, or username format" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(String(password), existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET || "dip@098",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: jwtToken,
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const userId = req.user.id;
    const id_user = await db.users.findOne({ where: { id: userId } });
    if (!id_user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const oldProfileImage = id_user.profileImage;
    const updatedUser = await db.users.update(
      {
        name,
        profileImage: req.file ? req.file.filename : id_user.profileImage,
      },
      { where: { id: userId } }
    );
    if (req.file && oldProfileImage) {
      const oldImagePath = path.join(
        __dirname,
        "../../../uploads",
        oldProfileImage
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting profile image:", err);
      });
    }
    if (!updatedUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: id_user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.users.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const checktodo = await db.todos.findOne({
      where: { userId, isDeleted: false },
    });
    if (checktodo) {
      return res
        .status(400)
        .json({ message: "User cannot be deleted as they have todos" });
    }
    await db.users.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};
module.exports = { signup, login, updateUser, deleteUser, userGetProfile };

