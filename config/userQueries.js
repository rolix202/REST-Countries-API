import AppError from "../utils/customError.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { query } from "./dbQuery.js";

export const createUserQuery = async (data) => {
    const { first_name, last_name, email, password } = data

    const hashedPassword = await hashPassword(password)
    
        const response = await query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [first_name, last_name, email, hashedPassword])

        const { password: hashedPasswordFromDb, created_at, updated_at, ...userWithoutPassword } = response.rows[0];
        
        return userWithoutPassword;
}

export const loginQuery = async (data) => {
    const { email, password } = data;

        const result = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            throw new AppError("Invalid email or password", 401);
        }

        const user = result.rows[0];

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const { password: _, created_at, updated_at, ...userWithoutPassword } = user;

        return userWithoutPassword;
};

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
        throw new AppError("Failed to fetch countries from the database", 500);
    }
};

export const getCountryByIdQuery = async (field_name, data) => {

    try {
        const result = await query(`SELECT * FROM countries WHERE LOWER(${field_name}) =  LOWER($1)`, [data]);
        return result.rows[0];
    } catch (err) {
        throw new AppError("Failed to fetch country from the database.", 500);
    }
};

export const getCountryNamesQuery = async (data) => {
    try {
        const result = await query(`SELECT language_code, name_common, name_official FROM country_names WHERE country_id = $1`, [data])
        return result.rows;
    } catch (error) {
        throw new AppError("Failed to fetch country names from the database.", 500);
    }
}

export const deleteCountryQuery = async (field_name, data) => {
    try {
        const result = await query(`DELETE FROM countries WHERE ${field_name} = $1 RETURNING *;`, [data]);
        return result.rows[0];
    } catch (err) {
        throw new AppError("Failed to delete country from the database.", 500);
    }
};
