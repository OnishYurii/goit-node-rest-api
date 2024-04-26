import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "onyshchenko27@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (data) => {
  const email = { ...data, from: "onyshchenko27@meta.ua" };
  await transporter.sendMail(email);
  return true;
};
