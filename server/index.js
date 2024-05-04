import express from 'express';
import cors from "cors";

import dotenv from "dotenv";
import {ConnectDB} from "./middleware/ConnectDB.js";
import auth from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/auth", auth);

// Connect to database
ConnectDB().then(() => console.log("Database connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));