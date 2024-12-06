import mongoose from "mongoose";
export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Database Connected");
    });
  } catch (error) {
    console.log("Error occured while connecting to database", error.message);
  }
}
