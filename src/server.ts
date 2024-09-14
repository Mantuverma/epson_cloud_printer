// src/server.ts
import express from "express";
import { sendPrintJobToEpson } from "./printService";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Serve the XML print file to Epson printers
app.get("/print-job.xml", (req, res) => {
  const filePath = path.join(__dirname, "print-job.xml");
  res.sendFile(filePath);
});

// Handle the callback from Epson Cloud after printing
app.post("/print-status", (req, res) => {
  console.log("Received print status from Epson Cloud:", req.body);
  res.sendStatus(200); // Acknowledge receipt of callback
});

// Test route to trigger the print job
app.get("/test-print", async (req, res) => {
  const deviceId = "af9f92766d5b462893297e87d26abd5f"; // Replace with the actual device ID
  const serial = "123456789"; // Replace with the actual serial number
  await sendPrintJobToEpson(deviceId, serial);
  res.send("Print job submitted.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
