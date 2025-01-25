import { body, validationResult } from "express-validator";


const toTitleCase = (text) => {
    if (!text) return text;
    return text
        .toLowerCase()
        .replace(/\b(\w)/g, (match) => match.toUpperCase());
};

const withValidationMessage = (whatToValidate) => {
    return (whatToValidate, (req, res, next) => {
        const error = validationResult(req)

        if (!error.isEmpty()){
            const errorMessage
        }
    })
}


export const validateCountryInputs = [
    body("name").notEmpty().withMessage("Counrty name is required.").escape().customSanitizer(toTitleCase),
    body("population").notEmpty().withMessage("Country population is required.").escape().isInt({ min: 0 }).withMessage("Population must be a positive integer.")
    .custom(value => value < 8000000000).withMessage("Population must be under 8 billion (current estimated global population)."),
    body("region").notEmpty().withMessage("Country region is required.").escape().customSanitizer(toTitleCase),
    body("capital").notEmpty().withMessage("Country capital is required.").escape().customSanitizer(toTitleCase),
    body("subregion").notEmpty().withMessage("Country subregion is required.").escape().customSanitizer(toTitleCase),

]