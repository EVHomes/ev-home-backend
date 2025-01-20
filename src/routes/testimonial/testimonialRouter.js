import { Router } from "express";
import {
  getTestimonial,
  addTestimonial,

} from "../../controller/testimonial.controller.js";


const testimonialRouter = Router();
testimonialRouter.get("/testimonial",getTestimonial);
testimonialRouter.post(
  "/add-testimonial",
  // authenticateToken,
  addTestimonial
);


export default testimonialRouter;