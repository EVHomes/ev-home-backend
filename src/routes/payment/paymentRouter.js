import { Router } from "express";
import {
  addPayment,
  getPayment,
  getPaymentbyFlat,
} from "../../controller/payment.controller.js";

const paymentRouter = Router();
paymentRouter.get("/payment", getPayment);
paymentRouter.post("/payment-add", addPayment);
paymentRouter.get("/get-payment-by-flat", getPaymentbyFlat);

export default paymentRouter;
