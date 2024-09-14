import express from "express";
import dotenv from "dotenv";
import { epsonRouter } from "./src/app";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

app.use(express.json());
app.use("/epson", epsonRouter); // Mount the Epson routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
