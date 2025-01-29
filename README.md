
# Country API

This is a backend API built with **Node.js**, **Express**, and **PostgreSQL** for managing countries and users. It supports common CRUD operations, user authentication, and authorization.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Countries Endpoints](#countries-endpoints)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

---

## Project Overview

This project provides an API for managing countries, including fetching country information, creating new countries, and deleting countries. It also supports user authentication, with roles assigned to users, such as "admin". 

- **CRUD Operations for Countries**: Add, get, and delete countries.
- **User Authentication**: Sign up, login, and token-based authentication using JWT.
- **Role-Based Authorization**: Admin role required to perform sensitive actions like creating or deleting countries.

---

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **Error Handling**: Custom error classes and global error handling
- **Environment Variables**: Managed via `.env` file

---

## Installation

### Step 1: Clone the repository
```bash
git clone https://github.com/rolix202/REST-Countries-API.git
cd repository-name
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a `.env` file in the root of the project and add the following variables:
```
PORT=server_port
NODE_ENV=your_environment
HOST=db_host
USER=your-db-username
DB=your-db-name
PASSWORD=your-db-password
DB_PORT=db_port
JWT_SECRET=your-secret-key
```

### Step 4: Set up the database
- Make sure PostgreSQL is installed and running.
- Create the database and tables as per your schema.

### Step 5: Start the application
```bash
npm run dev
```

---

## API Endpoints

### **Auth Endpoints**

1. **POST `/api/v1/auth/sign-up`**
   - **Description**: Registers a new user.
   - **Request body**:
     ```json
     {
       "first_name": "user_firstname",
       "last_name": "user_lastname",
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     ```json
     {
       "success": true,
       "message": "User registered successfully"
     }
     ```
   
2. **POST `/api/v1/auth/login`**
   - **Description**: Logs in a user and returns a JWT token.
   - **Request body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "User logged in successfully"
     }
     ```

### **Countries Endpoints**

1. **GET `/api/v1/countries`**
   - **Description**: Retrieves all countries.
   - **Response**:
     ```json
     [
       {
         "name": {
           "common": "Exampleland",
           "official": "The Republic of Exampleland",
           "nativeName": { "en": { "common": "Exampleland", "official": "The Republic of Exampleland" } }
         },
         "population": 1000000,
         "region": "Africa",
         "capital": "Example City",
         "subregion": "Northern Example"
       }
     ]
     ```

2. **GET `/api/v1/countries/name/:identifier`**
   - **Description**: Retrieves a country by name or ID.
   - **Parameters**:
     - `identifier`: Name or ID of the country.
   - **Response**:
     ```json
     {
       "name": {
         "common": "Exampleland",
         "official": "The Republic of Exampleland",
         "nativeName": { ... }
       },
       "population": 1000000,
       "region": "Africa",
       "capital": "Example City",
       "subregion": "Northern Example"
     }
     ```

3. **POST `/api/v1/countries`**
   - **Description**: Creates a new country. Requires admin role.
   - **Request body**:
     ```json
     {
       "name_common": "Exampleland",
       "name_official": "The Republic of Exampleland",
       "population": 1000000,
       "region": "Africa",
       "capital": "Example City",
       "subregion": "Northern Example",
       "nativeNames": [
         {
           "language_code": "en",
           "name_common": "Exampleland",
           "name_official": "The Republic of Exampleland"
         }
       ]
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Country created successfully",
       "data": { ... }
     }
     ```

4. **POST `/api/v1/countries/name/:identifier`**
   - **Description**: Deletes a country by name or ID. Requires admin role.
   - **Parameters**:
     - `identifier`: Name or ID of the country to be deleted.
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Country deleted successfully",
       "data": { ... }
     }
     ```

---

## Error Handling

The API follows a custom error handling strategy using the `AppError` class. There are two types of errors:

1. **Operational Errors** (e.g., invalid input, unauthorized access)
   - These errors are caught and handled gracefully, sending appropriate status codes (e.g., 400 for bad request, 401 for unauthorized).

2. **Programming Errors** (e.g., bugs in code, database connection issues)
   - These are logged in detail for debugging purposes, with a generic message sent to the user to ensure security (e.g., `Something went wrong. Please try again later`).

---

## Contributing

Feel free to fork the repository and submit pull requests. Make sure to:

- Write clear commit messages.
- Include unit tests for new features.
- Follow the code style and format.

---



