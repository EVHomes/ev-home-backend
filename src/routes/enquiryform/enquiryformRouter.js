import { Router } from "express";
import {
  addenquiryform,
  getenquiryform,
  
} from "../../controller/enquiryform.controller.js";

const enquiryformRouter = Router();
enquiryformRouter.get("/enquiryform",  getenquiryform);

enquiryformRouter.post(
  "/enquiryform-add",
  //  authenticateToken,
  addenquiryform,
);


export default enquiryformRouter;
