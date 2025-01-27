import { query } from "../config/dbQuery.js";
import { getAllCountriesQuery, getCountryByIdQuery, getCountryNamesQuery } from "../config/userQueries.js"
import { toSentenceCase } from "../utils/toSentenceCase.js";

export const getAllCountries = async (req, res) => {
    try {
        const result = await getAllCountriesQuery()
        
    // format results into rest counties structure
    const countries = result.reduce((acc, row) => {
        const countryId = row.id;
    
        // Initialize the country object if it doesn't already exist
        if (!acc[countryId]) {
            acc[countryId] = {
                name: {
                    common: toSentenceCase(row.name_common),
                    official: toSentenceCase(row.name_official),
                    nativeName: {}
                },
                population: row.population,
                region: toSentenceCase(row.region),
                capital: toSentenceCase(row.capital),
                subregion: toSentenceCase(row.subregion)
            };
        }
    
        // Add the native name for the given language code
        if (row.language_code) {
            acc[countryId].name.nativeName[row.language_code] = {
                common: toSentenceCase(row.native_name_common),
                official: toSentenceCase(row.native_name_official)
            };
        }
    
        return acc;
    }, {});
    
    // converted the object back into an array of countries
    const formattedCountries = Object.values(countries)

    res.status(200).json(formattedCountries);

    } catch (error) {
        console.error("Error fetching countries:", error);
        throw new Error("Could not fetch countries");
    }
}

export const createCountry = async (req, res) => {
    const { 
        name_common, name_official, population, region, capital, subregion, 
        nativeNames
    } = req.body;

    try {
        const insertCountryResult = await query(`
            INSERT INTO countries (name_common, name_official, population, region, capital, subregion)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `, [name_common, name_official, population, region, capital, subregion]);

        const countryId = insertCountryResult.rows[0].id;

        const insertNativeNamesPromises = nativeNames.map(async (nativeName) => {
            const { language_code, name_common: nativeNameCommon, name_official: nativeNameOfficial } = nativeName;

            if (!language_code || !nativeNameCommon || !nativeNameOfficial) {
                throw new Error(`Invalid native name data for language ${language_code}`);
            }

            await query(`
                INSERT INTO country_names (country_id, language_code, name_common, name_official)
                VALUES ($1, $2, $3, $4);
            `, [countryId, language_code, nativeNameCommon, nativeNameOfficial]);
        });

        // Wait for all native names to be inserted
        await Promise.all(insertNativeNamesPromises);

        
        const createdCountry = {
            id: countryId,
            name: {
                common: name_common,
                official: name_official,
                nativeName: nativeNames.reduce((acc, { language_code, name_common, name_official }) => {
                    acc[language_code] = {
                        common: name_common,
                        official: name_official
                    };
                    return acc;
                }, {})
            },
            population,
            region,
            capital,
            subregion
        };

        return res.status(201).json(createdCountry);

    } catch (err) {
        console.error("Error creating country:", err);
        return res.status(500).json({ error: "Failed to create country" });
    }
};

export const getCountryById = async (req, res) => {

    const { identifier } = req.params

    try {
        const isNumeric = /^\d+$/.test(identifier);
        const countryId = isNumeric ? identifier : null;
        const name = !isNumeric ? identifier : null;

        let countryResult;

        if (countryId) {
            countryResult = await getCountryByIdQuery("id", countryId)
        } else if (name){
            countryResult = await getCountryByIdQuery("name_common", name)
        }

        const country_name = await getCountryNamesQuery(countryResult.id)

        const nativeName = {}

        for (const row of country_name){
            nativeName[row.language_code] = {
                "common": toSentenceCase(row.name_common),
                "official": toSentenceCase(row.name_official)
            }  
        }

       const country = {
        "name" : {
            "common": toSentenceCase(countryResult.name_common),
            "official": toSentenceCase(countryResult.name_official),
            nativeName 
        },
        "population": countryResult.population,
        "region": toSentenceCase(countryResult.region),
        "capital": toSentenceCase(countryResult.capital),
        "subregion": toSentenceCase(countryResult.subregion)
       }

       res.status(200).json(country)
        
    } catch (error) {
        console.error("Error fetching country:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}
