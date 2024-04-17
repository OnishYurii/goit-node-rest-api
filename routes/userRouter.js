import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import {
  userRegister,
  userLogin,
  getCurrent,
  logout,
} from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), userRegister);

authRouter.post("/login", validateBody(loginSchema), userLogin);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
