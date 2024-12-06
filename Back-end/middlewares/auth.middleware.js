import { verifyToken } from "../services/jsonwebtoken.js";

export function authMiddleWare(req, res) {
  try {
    const token = req.cookies["token"];
    if (!token) {
      throw new Error("Token not Exists");
    }

    const user = verifyToken(token);
    if (!user) {
      throw new Error("Invalid Token");
    }
    req.user = user;

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in auth middlware", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}
