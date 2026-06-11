import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export async function userRegisterController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please enter your details",
    });
  }

  const isUserExistAlready = await userModel.findOne({ email });

  if (isUserExistAlready) {
    return res.status(404).json({
      success: false,
      message: "User already exist",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const createUser = await userModel.findById(user._id).select("-password");

  if (!createUser) {
    return res.status(404).json({
      success: false,
      message: "User do not created",
    });
  }

  const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    createUser,
  });
}

export async function userLoginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { userid: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "lax",
  });

  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: userData,
  });
}