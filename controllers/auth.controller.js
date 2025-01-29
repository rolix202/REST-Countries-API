import { createUserQuery, loginQuery } from "../config/userQueries.js"
import { signJwt } from "../utils/jwt.cookie.js";

export const createUser = async (req, res, next) => {
    try {
        const user = await createUserQuery(req.body)
        
        res.status(201).json({ success: true, message: "User created successfully", user });

    } catch (error) {

        console.error("Error creating user:", error.message);
        if (error.code === "23505") {
            throw new AppError("Email already exists", 400)
        }
        throw new AppError("An error occured while creating the user", 500)
    }
    
}

export const loginUser = async (req, res, next) => {
    
    try {
        const user = await loginQuery(req.body)

        const token = signJwt(user.id, user.role)

        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        })

        
    } catch (error) {
        next(error)
    }
    
}