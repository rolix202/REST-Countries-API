import pool from "./conn.js";

export const query = async (queryString, params) => {

    try {
        const result = await pool.query(queryString, params)
        
        return result

    } catch (error) {
        console.log("Database query error", { queryString, params, error: error });
        throw error
    }
} 