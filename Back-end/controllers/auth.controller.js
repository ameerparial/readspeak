import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  sendResetPasswordDoneEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/email.js";
import UserModel from "../models/auth.model.js";
import { createToken } from "../services/jsonwebtoken.js";

export async function signup(req, res) {
  const { email, username, password } = req.body;
  try {
    if (!email || !username || !password) {
      throw new Error("All field are required");
    }

    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("User with this email Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = new UserModel({
      email,
      username,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    sendVerificationEmail(email, verificationCode);

    return res.status(201).json({
      success: true,
      message: "User Created",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error in creating a new Account, ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Error("Invalid Credentials");
    }

    // Adding the json token
    const jsonToken = createToken({ ...user._doc, password: undefined });
    res.cookie("token", jsonToken);
    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Eror in Login, ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}
export async function logut(req, res) {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully." });
  } catch (error) {
    console.log("Error while logout...", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function verifyMe(req, res) {
  const { code } = req.body;
  try {
    const user = await UserModel.findOne({
      verificationCode: code,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid code or the code is expired.");
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    sendWelcomeEmail(user.email, user.username);

    return res.status(200).json({
      sucess: true,
      message: "Your Account is Verified Successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Eror in verify user, ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function forgetPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid Email");
    }
    // Generate the token and send to email;
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    sendResetPasswordEmail(email, token, user.username);
    return res
      .status(200)
      .json({ success: true, message: "Email is sent to you successfully" });
  } catch (error) {
    console.log("Eror in forgot password, ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}
export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!token || !password) {
      throw new Error("Invalid Token or Password");
    }
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() - 1000000000 },
    });

    if (!user) {
      throw new Error("Invalid Token or It is expired");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    user.save();

    sendResetPasswordDoneEmail(user.email, user.username);
    return res
      .status(200)
      .json({ success: true, message: "Your Password Reset Successfully" });
  } catch (error) {
    console.log("Eror in reset password, ", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}
