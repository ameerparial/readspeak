import express from "express";
import {
  login,
  logut,
  signup,
  verifyMe,
  resetPassword,
  forgetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleWare } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check-auth", authMiddleWare);
router.post("/signup", signup);
router.post("/verify-user", verifyMe);
router.post("/login", login);
router.post("/logout", logut);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
