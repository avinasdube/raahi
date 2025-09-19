import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const signToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "7d",
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge:
    (parseInt(process.env.TOKEN_MAX_AGE_DAYS || "7", 10) || 7) *
    24 *
    60 *
    60 *
    1000,
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const name = req.body.name || req.body.fullName;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "name, email and password are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());

    res
      .cookie("access_token", token, cookieOptions)
      .status(201)
      .json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());
    res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out" });
};

export const updateMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { name, currentPassword, newPassword } = req.body || {};

    if (typeof name === "string" && name.trim().length >= 2) {
      user.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({
            message: "Current password is required to set a new password",
          });
      }
      const ok = await user.comparePassword(currentPassword);
      if (!ok)
        return res.status(401).json({ message: "Invalid current password" });
      if (String(newPassword).length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters" });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
