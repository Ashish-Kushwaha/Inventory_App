// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // 1. Create transporter
    // console.log(to);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP
      port: 465, // SSL
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // App password or SMTP password
      },
    });

    // 2. Send email
    const info = await transporter.sendMail({
      from: `"The Inventory App " <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
