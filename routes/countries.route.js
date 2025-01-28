import { Router } from "express";
import { createCountry, deleteCountrybyId, getAllCountries, getCountryById } from "../controllers/countries.controller.js";
import { validateCountryInputs, validateCountryParams } from "../middlewares/validationMiddlewares.js";
import { checkRole } from "../middlewares/authorize.middleware.js";

const router = Router()

router.use((req, res, next) => {
    console.log("Router middleware invoked:", req.method, req.url);
    next();
});


router.route("/name/:identifier")
    .get(validateCountryParams, getCountryById)
    .post(checkRole("admin"), deleteCountrybyId)

router.route("/")
    .get(getAllCountries)
    .post(checkRole("admin"), validateCountryInputs, createCountry)

export default router