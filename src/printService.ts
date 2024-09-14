// src/printService.ts
import axios from "axios";
import { generatePrintXML } from "./xmlHelper";
import * as fs from "fs";
import * as path from "path";

export const sendPrintJobToEpson = async (deviceId: string, serial: string) => {
  // 1. Generate the ePOS Print XML data with the printer serial
  const xmlData = generatePrintXML(serial);

  // 2. Save the XML to a file (the printer will fetch this file)
  const xmlFilePath = path.join(__dirname, "print-job.xml");
  fs.writeFileSync(xmlFilePath, xmlData);

  // 3. Prepare the data for the Epson API request
  const requestBody = {
    callbackUrl: "http://yourserver.com/print-status", // Replace with your actual callback URL
    Url: "http://localhost:3000/print-job.xml", // Local URL where XML file is served
  };

  try {
    // 4. Make the POST request to Epson API
    const response = await axios.post(
      `https://epsonapi.com/api/v1/devices/${deviceId}/cloud/print`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "your-api-key", // Replace with your actual API key
        },
      }
    );
    console.log("Print job submitted:", response.data);
  } catch (error) {
    console.error("Error submitting print job:", error);
  }
};
