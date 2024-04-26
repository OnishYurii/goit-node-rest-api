import express from "express";
import validateBody from "../middlewares/validateBody.js";
import {
  registerSchema,
  loginSchema,
  emailSchema,
} from "../schemas/usersSchemas.js";
import {
  userRegister,
  userLogin,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
  verifyEmail,
  verifyEmailResend,
} from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), userRegister);

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), verifyEmailResend);

authRouter.post("/login", validateBody(loginSchema), userLogin);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch("/", authenticate, updateStatusUser);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
