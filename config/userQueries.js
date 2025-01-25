import { query } from "./dbQuery.js";

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

export const getCountryByIdQuery = async (id) => {
    try {
        const result = await query("SELECT * FROM countries WHERE id = $1;", [id]);
        return result.rows[0];
    } catch (err) {
        console.error("Error fetching country:", err);
        throw new Error("Could not fetch country");
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
