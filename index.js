import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });


import express from "express";
import { initApp } from "./src/initApp.js";

const app = express();
const port = +process.env.PORT || 3001




initApp(express, app)

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})


