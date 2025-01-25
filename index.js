import express from "express"
import morgan from "morgan";
import dotenv from "dotenv"

// local imports
import countriesRoute from "./routes/countries.route.js"

dotenv.config()
const app = express()

app.use(morgan("dev"))
app.use(express.json())

app.use("/api/v1/countries", countriesRoute)

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Server connected on PORT ${PORT}`);
})