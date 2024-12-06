import UserModel from "../models/auth.model.js";
import { createToken, verifyToken } from "../services/jsonwebtoken.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import fs from "fs";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
export async function handleUpdateUsername(req, res) {
  const { username } = req.body;
  const image_file = req.file;

  console.log("I am calling to Image uploader");

  try {
    const user = verifyToken(req.cookies["token"]);

    const updateObj = {};
    if (username) {
      updateObj.username = username;
    }
    if (image_file) {
      updateObj.profile = image_file.filename;
    }
    await UserModel.updateOne({ _id: user._id }, { $set: updateObj });
    // Update the token:
    const jsonToken = createToken({
      ...user,
      ...updateObj,
      password: undefined,
    });
    res.cookie("token", jsonToken);

    return res
      .status(201)
      .json({ success: true, message: "Profile Updated Successfully." });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Could not update the profile." });
  }
}
export async function handleUpdatePassword(req, res) {
  try {
    const { newPassword, oldPassword } = req.body;
    const user = verifyToken(req.cookies["token"]);

    const userData = await UserModel.findById(user._id);

    const result = await bcrypt.compare(oldPassword, userData.password);

    if (!result) {
      throw new Error("Your old password is wrong.");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      { _id: user._id },
      { $set: { password: newHashedPassword } }
    );

    return res
      .status(201)
      .json({ success: true, message: "Password Changed Successfully." });
  } catch (error) {
    console.log("Error while changing the password, ", error.message);
    console.log(error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleDeleteAccount(req, res) {
  try {
    const _id = verifyToken(req.cookies["token"])._id;
    await UserModel.deleteOne({ _id });

    // Clear cookie---

    res.clearCookie("token");

    return res
      .status(200)
      .json({ success: true, message: "Account Deleted Successfully." });
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message });
  }
}

export async function handleFavoriteSpeaker(req, res) {
  try {
    const body = req.body;

    console.log(body);
  } catch (err) {
    console.log(err.message);
  }
}

export async function handleWordMeaning(req, res) {
  const wordMeanings = [];
  const { words } = req.body;
  for (let word of words) {
    try {
      const isEnglishWord = /^[a-zA-Z]+$/.test(word);
      if (isEnglishWord) {
        const response = await axios.get(`${BASE_URL}/${word}`);
        wordMeanings.push({
          word: word,
          meanings: response.data[0].meanings,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`Word not found: ${word}`);
      } else {
        console.error(`Error fetching word ${word}:`, error.message);
      }
      wordMeanings.push({ word, meaning: "NOT FOUND" });
    }
  }

  // Send the gathered meanings back to the frontend
  res.json(wordMeanings);
}

export async function handlePDFReadFile(req, res) {
  try {
    // console.log("save");
    // Add the PDF file to the database:
    // console.log(req.file);
    const file = req.file;
    console.log(file);
    const user = verifyToken(req.cookies["token"]);
    // console.log(user._id);
    const db_user = await UserModel.findById(user._id);
    const fileData = {
      fileName: file.originalname,
      fileSize: file.size,
      filePath: `uploads/${user._id}/pdfs/${file.filename}`,
    };
    db_user.readPDFs.push(fileData);

    const updatedUser = await db_user.save();

    return res.status(200).json({
      message: "PDF uploaded successfully",
      pdfRead: updatedUser?.readPDFs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function handleGetPDFFiles(req, res) {
  try {
    const userID = verifyToken(req.cookies["token"])._id;
    console.log(userID);
    const user = await UserModel.findById(userID);
    if (!user) throw new Error("No PDFs exists");
    const pdfs = user.readPDFs;
    return res.status(200).json({ data: pdfs, success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message, data: [] });
  }
}

export async function handlePDFDelete(req, res) {
  try {
    const fileID = req.params.key;
    const filePath = req.query.filePath;

    const userID = verifyToken(req.cookies["token"])._id;

    const result = await UserModel.updateOne(
      { _id: userID },
      { $pull: { readPDFs: { _id: fileID } } }
    );

    if (result.modifiedCount > 0) {
      //Deleting the file from the folder
      fs.unlink(`./profiles/${filePath}`, (err, res) => {
        if (err) console.log(err.message);
        else console.log("File deleted Successfully.");
      });

      const user = await UserModel.findById(userID);
      return res.status(200).json({
        data: user?.readPDFs || [],
        success: true,
        message: "Deleted PDF Successfully...",
      });
    }

    throw new Error("Could not delete the PDF.");
  } catch (err) {
    return res.status(400).json({
      data: [],
      success: false,
      message: err.message,
    });
  }
}

// const files = user.readPDFs;

// fs.readFile(`./profiles/${filePath}`, (err, res) => {
//   console.log(res);
//   console.log(err);
// });
// console.log(files);

//
// const user = await UserModel.findById(userID);
// user.readPDFs.$pop();
