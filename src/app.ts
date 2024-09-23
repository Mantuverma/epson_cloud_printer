// import express, { Request, Response } from "express";
// import axios from "axios";

// export const epsonRouter = express.Router();
// epsonRouter.post("/print", async (req: Request, res: Response) => {
//   // return header Content-Type: text/xml; charset=utf-8
//   const url = `http://epson-cloud-printer.onrender.com/document.xml`; // URL of your ePOS XML document
//   try {
//     const response = await axios.post(
//       `https://pos-cloud-link.epson.com/public/api/v1/devices/${process.env.EPSON_DEVICE_ID}/cloud/print`,
//       {
//         CallbackUrl: process.env.CALLBACK_URL,
//         Url: url,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.EPSON_API_KEY,
//         },
//       }
//     );

//     res.status(200).json({
//       message: "Print job has been sent successfully.",
//       data: response.data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to send print job.",
//       error,
//     });
//   }
// });

// // Endpoint to handle the callback from Epson Cloud
// epsonRouter.post("/callback", (req: Request, res: Response) => {
//   console.log("Callback received:", req.body);
//   res.status(200).send("Callback received successfully.");
// });

import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize router
export const epsonRouter = express.Router();

// // Endpoint to return XML data for Epson
epsonRouter.get("/print-data", (req: Request, res: Response) => {
  const serialNumber = req.query.serial || "Unknown Serial";
  console.log("serialNumber", serialNumber);
  // Construct XML data
  const xmlPrintData = `<?xml version="1.0" encoding="utf-8"?>
    <PrintRequestInfo>
      <ePOSPrint>
        <Parameter>
          <devid>local_printer</devid>
          <timeout>10000</timeout>
        </Parameter>
        <PrintData>
          <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
            <text lang="en"/>
            <text smooth="true"/>
            <text align="center"/>
            <text font="font_b"/>
            <text width="2" height="2"/>
            <text reverse="false" ul="false" em="true" color="color_1"/>
            <text>Printer Serial: ${serialNumber}&#10;</text>
            <text>Hello naveen ;</text>
            <feed unit="12"/>
            <text>&#10;</text>
            <text align="left"/>
            <text font="font_a"/>
            <text width="1" height="1"/>
            <text reverse="false" ul="false" em="false" color="color_1"/>
            <text>Order&#9;0001&#10;</text>
            <text width="1" height="1"/>
            <text reverse="false" ul="false" em="false" color="color_1"/>
            <text>Time&#9;sept 23 2024;</text>
            <text>Seat&#9;A-4&#10;</text>
            <text>&#10;</text>
            <text width="1" height="1"/>
            <text reverse="false" ul="false" em="false" color="color_1"/>
            <text>Alt Beer&#10;</text>
            <text>&#9;$10.00  x  2</text>
            <text x="384"/>
            <text>    $20.00&#10;</text>
            <text>&#10;</text>
            <text reverse="false" ul="false" em="true"/>
            <text width="2" height="1"/>
            <text>TOTAL</text>
            <text x="264"/>
            <text>    $20.00&#10;</text>
            <text reverse="false" ul="false" em="false"/>
            <text width="1" height="1"/>
            <feed unit="12"/>
            <text align="center"/>
            <barcode type="code39" hri="none" font="font_a" width="2" height="60">0001</barcode>
            <feed line="3"/>
            <cut type="feed"/>
          </epos-print>
        </PrintData>
      </ePOSPrint>
    </PrintRequestInfo>`;

  // Send the XML response
  res.setHeader("Content-Type", "application/xml");
  res.send(xmlPrintData);
});

// Endpoint to handle Epson callback for print status
epsonRouter.post("/callback", (req: Request, res: Response) => {
  console.log("Callback received:", req.body);
  // Process the print status
  res.status(200).json({ message: "Callback received successfully" });
});

// // Endpoint to send print job request to Epson
epsonRouter.post("/send-print", async (req: Request, res: Response) => {
  const serialNumber = req.body.serial || "Unknown Serial";

  // URL for Epson to fetch the XML print data
  const xmlDataUrl = `https://epson-cloud-printer.onrender.com/epson/print-data?serial=${serialNumber}`;
  console.log("xmlDataUrl", xmlDataUrl);
  // Callback URL where Epson will notify the status
  const callbackUrl = `http://epson-cloud-printer.onrender.com/epson/callback`;

  const printJobData = {
    url: xmlDataUrl, // URL Epson fetches XML data from
    callbackurl: callbackUrl, // URL Epson sends status updates to
  };
  console.log("printJobData", printJobData);
  try {
    const response = await axios.post(
      `https://pos-cloud-link.epson.com/public/api/v1/devices/${process.env.EPSON_DEVICE_ID}/cloud/print`,
      printJobData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.EPSON_API_KEY, // Epson API Key
        },
      }
    );

    // Success response
    res.status(200).json({
      message: "Print job initiated successfully.",
      data: response.data,
    });
  } catch (error) {
    // Error response
    res.status(500).json({
      message: "Failed to initiate print job.",
      error,
    });
  }
});
