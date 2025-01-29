import { body, param, validationResult } from "express-validator";
import { query } from "../config/dbQuery.js";

const withValidationMessage = (whatToValidate) => {
    return [...whatToValidate, (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            const errorMessage = errors.array().map(err => err.msg)
            return res.status(400).json({ 
                message: "Invalid inputs", 
                errors: errorMessage 
            })
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

export const validateCountryParams = withValidationMessage([
    param('identifier')
        .notEmpty()
        .withMessage('Identifier is required.')
        .isString()
        .withMessage('Invalid identifier format.'),
])

export const authValidation = withValidationMessage([
        body("first_name")
            .notEmpty()
            .withMessage("First name is required")
            .trim()
            .escape(),
        body("last_name")
            .notEmpty()
            .withMessage("Last name is required")
            .trim()
            .escape(),
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .trim()
            .isEmail()
            .withMessage("Not a valid email address")
            .custom(async (value) => {
                const emailExist = await query("SELECT 1 FROM users WHERE email = $1", [value]);
                if (emailExist.rowCount > 0) {
                    throw new Error("Email already exists");
                }
            }),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
])

