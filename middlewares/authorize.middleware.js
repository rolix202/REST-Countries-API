import jwt from "jsonwebtoken";
import AppError from "../utils/customError.js";

export const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies.token; 

        if (!token) {
            return next(new AppError('Unauthorized: Token is missing', 401));
        }

        const secret = process.env.JWT_SECRET;
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return next(new AppError('Unauthorized: Invalid token', 401));
            }

            if (decoded.role !== requiredRole) {
                return next(new AppError('Forbidden: Insufficient privileges', 403));
            }

            req.user = decoded;
            next();
        });
    };
};