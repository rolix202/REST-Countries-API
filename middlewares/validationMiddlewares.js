import { body, validationResult } from "express-validator";

const withValidationMessage = (whatToValidate) => {
    return [...whatToValidate, (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            const errorMessage = errors.array().map(err => err.msg)
            return res.status(400).json({ message: errorMessage })
        }

        next()
    }]
}


export const validateCountryInputs = withValidationMessage([
    body("name_common")
        .notEmpty()
        .withMessage("Country name is required.")
        .escape()
        .toLowerCase(),
    
    body("name_official")
        .notEmpty()
        .withMessage("Country official name is required.")
        .escape()
        .toLowerCase(),

    body("population")
        .notEmpty()
        .withMessage("Country population is required.")
        .escape()
        .isInt({ min: 0 })
        .withMessage("Population must be a positive integer.")
        .custom(value => value < 8000000000)
        .withMessage("Population must be under 8 billion (current estimated global population)."),

    body("region")
        .notEmpty()
        .withMessage("Country region is required.")
        .escape()
        .toLowerCase(),

    body("capital")
        .notEmpty()
        .withMessage("Country capital is required.")
        .escape()
        .toLowerCase(),

    body("subregion")
        .notEmpty()
        .withMessage("Country subregion is required.")
        .escape()
        .toLowerCase(),

    body("nativeNames")
        .notEmpty()
        .withMessage("Native names are required.")
        .isArray()
        .withMessage("Native names must be an array."),

    body("nativeNames.*.name_common")
        .notEmpty()
        .withMessage("Native name (common) is required for each language.")
        .escape()
        .toLowerCase(),

    body("nativeNames.*.name_official")
        .notEmpty()
        .withMessage("Native name (official) is required for each language.")
        .escape()
        .toLowerCase(),

    body("nativeNames.*.language_code")
        .notEmpty()
        .withMessage("Language code is required.")
        .isLength({ max: 10 })
        .withMessage("Language code must be 10 characters or less.")
        .matches(/^[a-z]{2,3}(-[A-Z]{2,3})?$/)
        .withMessage("Invalid language code format (e.g., 'eng' or 'en-US')."),
])

