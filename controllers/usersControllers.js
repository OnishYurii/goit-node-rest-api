import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { User } from "../db/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import Jimp from "jimp";
import { nanoid } from "nanoid";

dotenv.config();

const { SECRET_KEY, BASE_URL } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = `${__dirname}/../public/avatars`;

export const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href= "${BASE_URL}/api/users/verify/${verificationToken}">Click verify mail</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const jwtToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token: jwtToken });

    res.status(201).json({
      token: jwtToken,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
};

export const updateStatusUser = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const { _id } = req.user;
    const allowedSubscriptions = ["starter", "pro", "business"];

    if (!allowedSubscriptions.includes(subscription)) {
      throw HttpError(400, "Invalid subscription value");
    }

    const updatedUser = await User.findOneAndUpdate(
      _id,
      { subscription },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      throw HttpError(400, "File was not uploaded");
    }

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const avatar = await Jimp.read(resultUpload);
    avatar.resize(250, 250).write(resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
