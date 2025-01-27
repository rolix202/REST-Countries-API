import { Router } from "express";
import { createCountry, getAllCountries, getCountryById } from "../controllers/countries.controller.js";
import { validateCountryInputs, validateCountryParams } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.route("/:identifier")
    .get(validateCountryParams, getCountryById)

router.route("/")
    .get(getAllCountries)
    .post(validateCountryInputs, createCountry)
    

    

export default router