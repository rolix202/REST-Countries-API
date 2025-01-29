import { Router } from "express";
import { createCountry, deleteCountrybyId, getAllCountries, getCountryById } from "../controllers/countries.controller.js";
import { validateCountryInputs, validateCountryParams } from "../middlewares/validationMiddlewares.js";
import { checkRole } from "../middlewares/authorize.middleware.js";

const router = Router()

router.route("/name/:identifier")
    .get(validateCountryParams, getCountryById)
    .post(checkRole("admin"), deleteCountrybyId)

router.route("/")
    .get(getAllCountries)
    .post(checkRole("admin"), validateCountryInputs, createCountry)

export default router