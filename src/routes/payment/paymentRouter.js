import { Router } from "express";
import {
  addPayment,
  getPayment,
  getPaymentbyFlat,
  updateCheckDates,
} from "../../controller/payment.controller.js";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paymentRouter = Router();
paymentRouter.get("/payment", getPayment);
paymentRouter.post("/payment-add", addPayment);
paymentRouter.post("/update-cheque-date/:id", updateCheckDates);
paymentRouter.get("/get-payment-by-flat", getPaymentbyFlat);
function extractNumber(str) {
  // Match the first sequence of digits in the string
  const match = str.match(/\d+/);
  // If a match is found, return it as a number; otherwise, return 0
  return match ? parseInt(match[0], 10) : 0;
}

paymentRouter.post("/payment-update", async (req, res) => {
  const results = [];
  const dataTuPush = [];
  const csvFilePath = path.join(__dirname, "payments_nine_square.csv");

  if (!fs.existsSync(csvFilePath)) {
    return res.status(400).send("CSV file not found");
  }
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        const {
          recordDate,
          recieptNo,
          account,
          paymentMode,
          flatNo,
          name,
          totalRecieved,
          stampDutyReg,
          bookingAmount,
          gst,
          tds,
        } = row;

        dataTuPush.push({
          projects: "project-ev-9-square-vashi-sector-9",
          recordDate,
          recieptNo,
          account,
          paymentMode: paymentMode?.trim(),
          flatNo,
          customerName: name?.split("/")[0]?.trim(),
          amtReceived: extractNumber(totalRecieved),
          stampDutyReg: extractNumber(stampDutyReg),
          bookingAmount: extractNumber(bookingAmount),
          gst: extractNumber(gst),
          tds: extractNumber(tds),
        });
      }
      // await leadModel.insertMany(dataTuPush);
      // Send the results only after processing is done
      return res.send(dataTuPush);
    })
    .on("error", (err) => {
      return res.status(500).send({ error: err.message });
    });
});

export default paymentRouter;
