import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { META_PASSWORD } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "mega-leion@ukr.net",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (data) => {
  const email = { ...data, from: "mega-leion@ukr.net" };
  await transporter.sendMail(email);
  return true;
};
