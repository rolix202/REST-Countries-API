import express from "express"
import morgan from "morgan";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

// local imports
import countriesRoute from "./routes/countries.route.js"
import authRoute from "./routes/auth.route.js"
import { globalErrorHandler, handleInvalidRoute } from "./utils/globalErrorHandler.js";


dotenv.config()
const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/countries", countriesRoute)

app.use(handleInvalidRoute);

app.use(globalErrorHandler)

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Server connected on PORT ${PORT}`);
})