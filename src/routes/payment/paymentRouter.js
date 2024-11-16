import { Router } from "express";
import { addPayment, getPayment } from "../../controller/payment.controller.js";

const paymentRouter = Router();
paymentRouter.get("/payment",getPayment);
paymentRouter.post("/payment-add",addPayment);
export default paymentRouter;