import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
});

const createDatabase = async () => {
    const dbName = "db_countries_api";

    try {
        const client = await pool.connect();

        const dbExists = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (dbExists.rowCount === 0) {
            console.log(`Database "${dbName}" doesn't exist. Creating it ... `);

            await client.query(`CREATE DATABASE ${dbName};`);
            console.log(`Database "${dbName}" created successfully`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }

        client.release();
    } catch (error) {
        console.error("Error creating database:", error.message);
    }
};

const createTables = async () => {
    const dbPool = new Pool({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DB,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        const client = await dbPool.connect();

        console.log("Creating tables...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id SERIAL PRIMARY KEY,
                name_common VARCHAR (255) NOT NULL UNIQUE,
                name_official VARCHAR (255) NOT NULL UNIQUE,
                population INT NOT NULL,
                region VARCHAR (255) NOT NULL,
                capital VARCHAR (255) UNIQUE NOT NULL,
                subregion VARCHAR (255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() 
            );`);

        console.log("Countries table created successfully.");

        await client.query(`
                CREATE TABLE IF NOT EXISTS country_names (
                    country_id INT REFERENCES countries(id) ON DELETE CASCADE,
                    language_code VARCHAR (10) NOT NULL,
                    name_common VARCHAR(255) NOT NULL,
                    name_official VARCHAR(255) NOT NULL,
                    PRIMARY KEY (country_id, language_code)
                );`);

        console.log("Country_Names table created successfully.");

        await client.query(`
                CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8),
        role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

            `);

        console.log("user table created successfully");

        // Trigger to update `updated_at` on users table
        await client.query(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
  
        CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp();
      `);
        console.log("Trigger for updating timestamps created successfully.");

        await client.query(`
            -- Function to assign 'admin' role to the first user
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
DECLARE
    user_count INT;
BEGIN
    -- Check the number of users currently in the table
    SELECT COUNT(*) INTO user_count FROM users;

    -- If no users exist, set the role to 'admin'
    IF user_count = 0 THEN
        NEW.role := 'admin';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the assign_admin_role function on INSERT
CREATE TRIGGER trigger_assign_admin_role
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION assign_admin_role();
        `);

        console.log("Trigger for admin assign created successfully.");

        client.release();
    } catch (error) {
        console.error("Error setting up tables or seeding data:", error.message);
    } finally {
        dbPool.end();
    }
};

(async () => {
    console.log("Starting database setup...");
    await createDatabase();
    await createTables();
    console.log("Database setup complete.");

    pool.end();
})();
