import jwt from "jsonwebtoken";

export const checkRole = (requiredRole) => {
    return (req, res, next) => {
     
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: "Unauthorized: Token is missing" });
            }

            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);

            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error("Authorization error:", error.message);
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};
