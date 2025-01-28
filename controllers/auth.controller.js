import { createUserQuery } from "../config/userQueries.js"

export const createUser = async (req, res) => {
    try {
        const user = await createUserQuery(req.body)
        
        res.status(201).json({ success: true, message: "User created successfully", user });
        
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    
}