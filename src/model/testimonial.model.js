import mongoose from "mongoose";

export const testimonialSchema = new mongoose.Schema(
  {
    
    title: { type: String, required: true },
    videoUrl: {
      type: String,
      default: null,
    },
    thumbnail: { type: String, default: null },
   
  },

);

// Create the model
const testimonialModel = mongoose.model("Testimonial", testimonialSchema, "testimonial");
export default testimonialModel;
