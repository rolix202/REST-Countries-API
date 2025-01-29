import AppError from "./customError.js"


export const handleInvalidRoute = (req, res, next) => {
    res.status(404).json({
        message: "The requested resource was not found on this server",
        path: req.originalUrl,
        suggestion: "Please check the API documentation for valid endpoints",
    });
};


const isProduction = process.env.NODE_ENV === "production"

export const globalErrorHandler = (err, req, res, next) => {
    
    if (err.isOperational) {
        console.error("Operational error:", err.message);
    } else {
        console.error("Programming error:", err.stack);
    }

    const statusCode = err.statusCode || 500; 
    const message = err.message || 'something went wrong, try again later'; 

    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};
