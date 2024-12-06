import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connect } from "./connection/connect.js";
import authRouter from "./routes/auth.route.js";
import ttsRouter from "./routes/tts.route.js";
import userRouter from "./routes/user.route.js";
import path from "path";

const __dirname = path.resolve();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT;

connect();

// Serve static files from the 'public/assets' directory
app.use(
  "/profiles",
  express.static(path.join(__dirname, "Back-end", "profiles"))
);

app.use("/api/auth", authRouter);
app.use("/tts", ttsRouter);
app.use("/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "front-end", "build")));
  app.get("*", (req, res) => {
    console.log("I am caled");
    res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is listening at the port", PORT);
});
