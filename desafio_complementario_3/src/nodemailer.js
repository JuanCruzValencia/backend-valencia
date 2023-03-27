import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "jcvalenciaver@gmail.com",
    pass: process.env.NODE_APP_PASSWORD,
  },
});
