import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import { userRegister, userLogin } from "../controllers/usersControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), userRegister);

authRouter.post("/login", validateBody(loginSchema), userLogin);

export default authRouter;
