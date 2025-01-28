import { hashPassword } from "../utils/hashPassword.js";
import { query } from "./dbQuery.js";

export const createUserQuery = async (data) => {
    const { first_name, last_name, email, password } = data

    const hashedPassword = await hashPassword(password)
    
    try {
        const response = await query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [first_name, last_name, email, hashedPassword])

        const { password: hashedPasswordFromDb, created_at, updated_at, ...userWithoutPassword } = response.rows[0];
        
        return userWithoutPassword;
        
    } catch (error) {
        console.error("Error creating user:", error.message);
        if (error.code === "23505") {
            throw new Error("Email already exists");
        }
        throw new Error("Failed to create user");
    }
}

export const getAllCountriesQuery = async () => {

    try {
        const result = await query(`
            SELECT
                c.id,
                c.name_common,
                c.name_official,
                c.population,
                c.region,
                c.capital,
                c.subregion,
                cn.language_code,
                cn.name_common AS native_name_common,
                cn.name_official AS native_name_official
            FROM countries c
            LEFT JOIN country_names cn ON c.id = cn.country_id;
            `, []);

        return result.rows;

    } catch (err) {
        console.error("Error fetching countries:", err);
        throw new Error("Could not fetch countries");
    }
};

export const getCountryByIdQuery = async (field_name, data) => {

    try {
        const result = await query(`SELECT * FROM countries WHERE LOWER(${field_name}) =  LOWER($1)`, [data]);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching country:", err);
        throw new Error("Could not fetch country");
    }
};

export const getCountryNamesQuery = async (data) => {
    try {
        const result = await query(`SELECT language_code, name_common, name_official FROM country_names WHERE country_id = $1`, [data])
        return result.rows;
    } catch (error) {
        console.error("Error fetching country:", err);
        throw new Error("Could not fetch country");
    }
}

export const deleteCountryQuery = async (field_name, data) => {
    try {
        const result = await query(`DELETE FROM countries WHERE ${field_name} = $1 RETURNING *;`, [data]);
        return result.rows[0];
    } catch (err) {
        console.error("Error deleting country:", err);
        throw new Error("Could not delete country");
    }
};
