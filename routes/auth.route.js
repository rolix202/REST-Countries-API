import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller.js";
import { authValidation } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.post("/sign-up", authValidation, createUser)
router.post("/login", loginUser)

export default router