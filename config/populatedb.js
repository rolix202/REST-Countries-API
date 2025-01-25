import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pg

const pool =  new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT
})

const createDatabase = async () => {
    const dbName = "db_countries_api"

    try {

        const client = await pool.connect()

        const dbExists = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName])

        if (dbExists.rowCount === 0){
            console.log(`Database "${dbName}" doesn't exist. Creating it ... `);

            await client.query(`CREATE DATABASE ${dbName};`)
            console.log(`Database "${dbName}" created successfully`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
            
        }

        client.release()
        
    } catch (error) {
        console.error("Error creating database:", error.message);
    }
}

const createTables = async () => {
    const dbPool = new Pool({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DB,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT
    })

    try {
        const client = await dbPool.connect()

        console.log("Creating tables...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id SERIAL PRIMARY KEY,
                name VARCHAR (255) NOT NULL UNIQUE,
                population INT NOT NULL,
                region VARCHAR (255) NOT NULL,
                capital VARCHAR (255) UNIQUE NOT NULL,
                subregion VARCHAR (255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() 
            );`
        );

            console.log("Table created successfully.");
            
        client.release()
    } catch (error) {
        console.error("Error setting up tables or seeding data:", error.message);
    } finally {
        dbPool.end()
    }
}

(async () => {
    console.log("Starting database setup...");
    await createDatabase();
    await createTables();
    console.log("Database setup complete.");
    
    pool.end()
})()