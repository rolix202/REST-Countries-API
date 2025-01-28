import { Router } from "express";
import { createCountry, deleteCountrybyId, getAllCountries, getCountryById } from "../controllers/countries.controller.js";
import { validateCountryInputs, validateCountryParams } from "../middlewares/validationMiddlewares.js";

const router = Router()

router.route("/name/:identifier")
    .get(validateCountryParams, getCountryById)
    .post(deleteCountrybyId)

router.route("/")
    .get(getAllCountries)
    .post(validateCountryInputs, createCountry)
    
    
export default router