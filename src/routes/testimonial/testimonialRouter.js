import { Router } from "express";
import {
  getTestimonial,
  addTestimonial,
  getTestiomonialById
} from "../../controller/testimonial.controller.js";


const testimonialRouter = Router();
testimonialRouter.get("/testimonial",getTestimonial);
testimonialRouter.post(
  "/add-testimonial",
  // authenticateToken,
  addTestimonial
);
testimonialRouter.get(
  "/testimonial-projects/:projects",
  // authenticateToken,
  getTestiomonialById
);



export default testimonialRouter;