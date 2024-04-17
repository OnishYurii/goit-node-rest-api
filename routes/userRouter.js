import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import {
  userRegister,
  userLogin,
  getCurrent,
} from "../controllers/usersControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), userRegister);

authRouter.post("/login", validateBody(loginSchema), userLogin);

authRouter.get("/current", authenticate, getCurrent);

export default authRouter;
