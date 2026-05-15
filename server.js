import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import {pool} from "./config/db.js";

const app = express()


app.use(express.json())
app.use(cors())
dotenv.config({quiet:true})
const PORT = 3000 || process.env.PORT

//Routes
app.get('/',(req, res)=>{
    res.send("VCS is welcoming u")
})

app.use("/user", userRoutes)

pool.connect().then(
    app.listen(PORT, () => {
        console.log("Server running on http://localhost:3000")
    })
).catch("Error connecting to DB")