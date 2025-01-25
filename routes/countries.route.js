import { Router } from "express";
import { getAllCountries } from "../controllers/countries.controller.js";

const router = Router()

router.route("/")
    .get(getAllCountries)

export default router