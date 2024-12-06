import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter object using the default SMTP transport
let transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

export function sendEmail(options) {
  const mailOptions = {
    ...options,
    from: `"ReadSpeak App" <${process.env.SENDER_EMAIL}>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error in sending Email", error.message);
    }
    console.log("Email Send Successfully");
  });
}
