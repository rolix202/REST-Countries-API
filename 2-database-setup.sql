\c orangedb;

-- Creating countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name_common VARCHAR (255) NOT NULL UNIQUE,
    name_official VARCHAR (255) NOT NULL UNIQUE,
    population INT NOT NULL,
    region VARCHAR (255) NOT NULL,
    capital VARCHAR (255) UNIQUE NOT NULL,
    subregion VARCHAR (255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Creating country_names table (for multiple languages)
CREATE TABLE IF NOT EXISTS country_names (
    country_id INT REFERENCES countries(id) ON DELETE CASCADE,
    language_code VARCHAR (10) NOT NULL,
    name_common VARCHAR(255) NOT NULL,
    name_official VARCHAR(255) NOT NULL,
    PRIMARY KEY (country_id, language_code)
);

-- Creating users table for authentication
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

-- Trigger for updating timestamps on user updates
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

