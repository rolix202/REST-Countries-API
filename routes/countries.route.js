import { Router } from "express";
import { createCountry, getAllCountries } from "../controllers/countries.controller.js";
import { validateCountryInputs } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.route("/")
    .get(getAllCountries)
    .post(createCountry)

export default router