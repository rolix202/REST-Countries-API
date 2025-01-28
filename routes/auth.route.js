import { Router } from "express";
import { createUser } from "../controllers/auth.controller.js";
import { authValidation } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.post("/sign-up", authValidation, createUser)

export default router