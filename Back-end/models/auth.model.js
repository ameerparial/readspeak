import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    profile: {
      type: String,
      default: "unknownuser.jpeg",
    },
    password: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    readPDFs: [
      {
        fileName: String,
        fileSize: Number,
        filePath: String,
        uploadDate: { type: Date, default: Date.now },
      },
    ],

    verificationCode: String,
    verificationCodeExpiresAt: Date,

    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export default model("user", UserSchema);
