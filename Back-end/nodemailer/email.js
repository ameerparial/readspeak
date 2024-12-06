import { sendEmail } from "./config.js";
import {
  MESSAGE_FROM_USER,
  PASSWORD_RESET_EMAIL_TEMPLATE,
  RESET_PASSWORD_DONE_TEMPLATE,
  VERIFICATION_CODE_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplate.js";

export async function sendVerificationEmail(userEmail, otp) {
  console.log("Sender email is : ");
  console.log(process.env.SENDER_EMAIL);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Account Verification",
    html: VERIFICATION_CODE_EMAIL_TEMPLATE.replace("{otpcodereplacer}", otp),
  };

  sendEmail(mailOptions);
}

export async function sendWelcomeEmail(userEmail, username) {
  console.log("Sender email is : ");
  console.log(process.env.SENDER_EMAIL);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Welcome to ReadSpeak",
    html: WELCOME_EMAIL_TEMPLATE.replace("{usernamereplacer}", username),
  };

  sendEmail(mailOptions);
}

export async function sendResetPasswordEmail(userEmail, token, username) {
  const mailOptions = {
    to: userEmail,
    subject: "Reset Password",
    html: PASSWORD_RESET_EMAIL_TEMPLATE.replace(
      "{tokenreplacer}",
      token
    ).replace("{usernamereplacer}", username),
  };

  sendEmail(mailOptions);
}

export async function sendResetPasswordDoneEmail(userEmail, username) {
  console.log("Sender email is : ");
  console.log(process.env.SENDER_EMAIL);
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: "Password Reset Successfully",
    html: RESET_PASSWORD_DONE_TEMPLATE.replace("{usernamereplacer}", username),
  };

  sendEmail(mailOptions);
}

export async function sendUserMessage(message, userEmail) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.SENDER_EMAIL,
    subject: "New Message from the user.",
    html: MESSAGE_FROM_USER.replace("{{user_message}}", message).replace(
      "{{user_email}}",
      userEmail
    ),
  };
  sendEmail(mailOptions);
}
