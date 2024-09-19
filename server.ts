import express from "express";
import dotenv from "dotenv";
import { epsonRouter } from "./src/app";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());

dotenv.config();
epsonRouter.use(bodyParser.json()); // Parse application/json
epsonRouter.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

app.use(express.json());
app.use("/epson", epsonRouter); // Mount the Epson routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
