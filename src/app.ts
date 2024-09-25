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
epsonRouter.post("/print-data", (req: Request, res: Response) => {
  const serialNumber = req.query.serial || "Unknown Serial";

  // Example dynamic receipt data
  const receiptData = {
    orderId: "#14356",
    orderReceivedTime: "12:30 PM | 02-02-2024",
    estimatedDeliveryTime: "1:00 PM | 02-02-2024",
    items: [
      {
        name: "Coffee",
        quantity: 1,
        price: 5.0,
        extra: "SELECTED SIZE",
        size: "Medium",
        sizePrice: 1.0,
      },
      {
        name: "Sandwich",
        quantity: 5,
        price: 5.0,
        extra: "SELECTED SIZE",
        size: "Medium",
        sizePrice: 5.0,
      },
    ],
    subtotal: 10.0,
    deliveryFee: 2.0,
    serviceCharge: 12.0,
    vat: 5.0,
    total: 50.0,
    specialInstructions:
      "Extra cheese on the sandwich, please. Hold the mushrooms.",
    customerName: "Shabeer",
    address: "Flat 4, 117 the parade, Highstreet, Watford WD17 1LU",
    phone: "07767878723",
    email: "shabeer@yopmail.com",
  };

  // Dynamically generate the XML data for the receipt with item names on the left and prices on the right
  const itemsXml = receiptData.items
    .map(
      (item) => `
      <text>${item.quantity} x ${item.name.padEnd(20)}£${item.price.toFixed(
        2
      )}&#10;</text>
      <text>${item.extra}&#10;${item.size.padEnd(20)}£${item.sizePrice.toFixed(
        2
      )}&#10;</text>
    `
    )
    .join("");

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
            <!-- Header Section -->
            <text lang="en"/>
            <text smooth="true"/>
            <text align="left"/>
            <text font="font_b" width="2" height="1" em="true"/>
            <text>Grauns&#10;</text>
            <feed unit="12"/>
            <text align="left" width="2" height="1" em="true"/>
            <text >NO: 4A Parson Street,&#10; Banbury, Oxfordshire&#10;</text>
            <text>England, OX16 5LW&#10;</text>
            <text>VAT NUMBER: 425864770&#10;</text>
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Order Details Section -->
            <text align="left"/>
            <text font="font_a" width="2" height="1"  em="true"/>
            <text>Order ID: ${receiptData.orderId}&#9;Uber Eat&#10;</text>
            <text>Order received: ${receiptData.orderReceivedTime}&#10;</text>
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Items Section -->
            <text font="font_a" width="2" height="1"  em="true"/>
            <text>Items&#10;</text>
            ${itemsXml}
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Charges Section -->
            <text>Subtotal&#9;&#9;£${receiptData.subtotal.toFixed(
              2
            )}&#10;</text>
            <text>Delivery fee&#9;£${receiptData.deliveryFee.toFixed(
              2
            )}&#10;</text>
            <text>Service charge&#9;&#9;£${receiptData.serviceCharge.toFixed(
              2
            )}&#10;</text>
            <text>VAT (20%)&#9;&#9;£${receiptData.vat.toFixed(2)}&#10;</text>
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Total Section -->
            <text width="2" height="1" em="true"/>
            <text font="font_b">TOTAL&#9;&#9;&#9;£${receiptData.total.toFixed(
              2
            )}&#10;</text>
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Special Instructions Section -->
            <text>Special Instructions&#10;&#10;</text>
            <text>${receiptData.specialInstructions}&#10;</text>
            <feed unit="12"/>
           <text>------------------------&#10;&#10;</text>

            <!-- Customer Details Section -->
            <text>Customer Name: ${receiptData.customerName}&#10;&#10;</text>
            <text>Delivery address: ${receiptData.address}&#10;&#10;</text>
            <text>Phone: ${receiptData.phone}&#10;</text>
            <text>Email: ${receiptData.email}&#10;</text>
            <feed unit="12"/>
            <text>------------------------&#10;&#10;</text>

            <!-- Footer Section -->
            <text align="center"/>
            <text>Thank you for ordering with us&#10;</text>
            <feed line="3"/>
            <cut type="feed"/>
          </epos-print>
        </PrintData>
      </ePOSPrint>
    </PrintRequestInfo>`;

  // Set the correct content-type header
  res.setHeader("Content-Type", "text/xml; charset=utf-8");

  // Send the XML response
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

  // Ensure the URL is correctly formatted and accessible
  const baseUrl = "https://epson-cloud-printer.onrender.com"; // HTTPS should be used to ensure valid URL format

  // URL for Epson to fetch the XML print data
  const xmlDataUrl = `${baseUrl}/epson/print-data?serial=${serialNumber}`;
  console.log("xmlDataUrl", xmlDataUrl);

  // Callback URL where Epson will notify the status
  const callbackUrl = `${baseUrl}/epson/callback`;
  console.log("callbackUrl", callbackUrl);

  const printJobData = {
    CallbackUrl: callbackUrl, // URL Epson sends status updates to
    Url: xmlDataUrl, // URL Epson fetches XML data from
  };
  console.log("printJobData", printJobData);
  console.log("device id", process.env.EPSON_DEVICE_ID);
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
  } catch (error: any) {
    // Error response
    console.error("Error initiating print job:", {
      message: error.message,
      status: error.response?.status, // HTTP status code
      data: error.response?.data, // Server response data
      config: error.config, // Request config that was sent
    });
    res.status(500).json({
      message: "Failed to initiate print job.",
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
});

// Grauns
// NO: 4A Parson Street, Banbury, Oxfordshire, England, OX16 5LW.
// VAT NUMBER: 425864770
// ----------------------------------------
// Order ID: #14356
// Just Eat
// Order received: 12:30 PM | 02-02-2024
// Estimated delivery time: 1:00 PM | 02-02-2024
// ----------------------------------------
// Items
// 1 x Coffee              £5.00
// SELECTED SIZE
// Medium                  £1.00
// ----------------------------------------
// 5 x Sandwich            £5.00
// SELECTED SIZE
// Medium                  £5.00
// ----------------------------------------
// Subtotal                £10.00
// Delivery fee            £2.00
// Service charge          £12.00
// Bad charge              £24.00
// VAT (20%)               £5.00
// ----------------------------------------
// TOTAL                   £50.00
// ----------------------------------------
// Special Instructions
// Extra cheese on the sandwich, please.
// Hold the mushrooms.
// ----------------------------------------
// Customer Name: Shabeer
// Delivery address: Flat 4, 117 The Parade, High Street, Watford WD17 1LU
// Phone: 07767878723
// Email: shabeer@yopmail.com
// ----------------------------------------
// Thank you for ordering with us!
