import express, { Request, Response } from "express";
import axios from "axios";

export const epsonRouter = express.Router();

// Endpoint to initiate a print job
epsonRouter.post("/print", async (req: Request, res: Response) => {
  const url = `http://epson-cloud-printer.onrender.com/document.xml`; // URL of your ePOS XML document

  try {
    const response = await axios.post(
      `https://pos-cloud-link.epson.com/public/api/v1/devices/${process.env.EPSON_DEVICE_ID}/cloud/print`,
      {
        callbackUrl: process.env.CALLBACK_URL,
        Url: url,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.EPSON_API_KEY,
        },
      }
    );

    res.status(200).json({
      message: "Print job has been sent successfully.",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send print job.",
      error,
    });
  }
});

// Endpoint to handle the callback from Epson Cloud
epsonRouter.post("/callback", (req: Request, res: Response) => {
  console.log("Callback received:", req.body);
  res.status(200).send("Callback received successfully.");
});
