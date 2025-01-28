import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const signJwt = (id, role) => {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return token
}

