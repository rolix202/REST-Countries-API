import { Router } from "express";
import { createCountry, getAllCountries, getCountryById } from "../controllers/countries.controller.js";
import { validateCountryInputs } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.route("/:id")
    .get(getCountryById)

router.route("/")
    .get(getAllCountries)
    .post(validateCountryInputs, createCountry)
    

    

export default router