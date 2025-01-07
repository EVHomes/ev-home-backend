import { Router } from "express";
import {
  addFeedbackEnquiry,
  getFeedbackEnquiry,
  getFeedbackEnquiryById
} from "../../controller/feedbackEnquiry.controller.js";

const feedbackEnquiryRouter = Router();
feedbackEnquiryRouter.get("/feedback-enquiry", getFeedbackEnquiry);


feedbackEnquiryRouter.get("/feedback-qnuiry-id/:id",getFeedbackEnquiryById);


feedbackEnquiryRouter.post(
  "/feedback-enquiry-add/:id",
  //  authenticateToken,
  addFeedbackEnquiry,
  
);

export default feedbackEnquiryRouter;
