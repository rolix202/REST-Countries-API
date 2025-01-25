import { query } from "./dbQuery.js";

export const getAllCountriesQuery = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    try {
        const result = await query("SELECT * FROM countries LIMIT $1 OFFSET $2;", [
            limit,
            offset,
        ]);
        return result.rows;
    } catch (err) {
        console.error("Error fetching countries:", err);
        throw new Error("Could not fetch countries");
    }
};

export const getCountryByIdQuery = async (id) => {
    try {
        const result = await query("SELECT * FROM countries WHERE id = $1;", [id]);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching country:", err);
        throw new Error("Could not fetch country");
    }
};

export const createCountryQuery = async (data) => {

    const { name, description, population, region, capital, subregion } = data;

    try {
        const result = await query(
            "INSERT INTO countries (name, description, population, region, capital, subregion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [name, description, population, region, capital, subregion]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Error creating country:", err);
        throw new Error("Could not create country");
    }
};

export const updateCountryQuery = async (id, data) => {
   
    const { name, description, population, region, capital, subregion } = data;

    try {
        const result = await query(
            "UPDATE countries SET name = $1, description = $2, population = $3, region = $4, capital = $5, subregion = $6 WHERE id = $7 RETURNING *;",
            [name, description, population, region, capital, subregion, id]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Error updating country:", err);
        throw new Error("Could not update country");
    }
};

export const deleteCountryQuery = async (id) => {
    try {
        const result = await query("DELETE FROM countries WHERE id = $1 RETURNING *;", [id]);
        return result.rows[0];
    } catch (err) {
        console.error("Error deleting country:", err);
        throw new Error("Could not delete country");
    }
};
