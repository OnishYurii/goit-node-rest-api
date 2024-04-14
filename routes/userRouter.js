import express from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema } from "../schemas/usersSchemas.js";
import { userRegister } from "../controllers/usersControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), userRegister);

export default authRouter;
