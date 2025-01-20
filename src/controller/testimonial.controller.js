import testimonialModel from "../model/testimonial.model.js";
import { errorRes, successRes } from "../model/response.js";
import { encryptPassword } from "../utils/helper.js";

export const getTestimonial = async (req, res) => {
  try {
    const respTesti = await testimonialModel.find();
    return res.send(
      successRes(200, "Get Testimonial", {
        data: respTesti,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addTestimonial = async (req, res) => {
  const body = req.body;

  const {
    title, videoUrl, thumbnail, } = body;

try {
 
  if (!body) return res.send(errorRes(403, "testimonial is required"));
//   const newGeoId = "geo-" + geofence?.replace(/\s+/g, "-").toLowerCase();

  const newTestimonial = await testimonialModel.create({
   ...body
    
  });
  await newTestimonial.save();

  return res.send(
    successRes(200, `testimonial added successfully: ${title}`, {
      data: newTestimonial,
    })
  );
} catch (error) {
  return res.send(errorRes(500, error));
}
};