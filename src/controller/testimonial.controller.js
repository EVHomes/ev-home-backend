import testimonialModel from "../model/testimonial.model.js";
import ourProjectModel from "../model/ourProjects.model.js";
import { errorRes, successRes } from "../model/response.js";
import { encryptPassword } from "../utils/helper.js";

export const getTestimonial = async (req, res) => {
  try {
    const respTesti = await testimonialModel.find().populate({path:"projects",select:"name locationName locationLink"});
    return res.send(
      successRes(200, "Get Testimonial", {
        data: respTesti,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const getTestiomonialById = async (req, res, next) => {
  const projects = req.params.projects;

  try {
    if (!projects) return res.send(errorRes(403, "projects is required"));

    const respTest = await testimonialModel
      .find({projects:projects})
      .populate({
        select: "name locationName locationLink",
        path: "projects",
      });

      if (!respTest)
        return res.send(
          successRes(404, `Projects not found with id:${projects}`, {
            data: respTest,
          })
        );

    return res.send(
      successRes(200, "Similar Leads", {
        data: respTest,
      })
    );
  } catch (error) {
    next(error);
  }
};


export const addTestimonial = async (req, res) => {
  const body = req.body;

  const {
    title, videoUrl, thumbnail,projects } = body;

try {
 
  if (!body) return res.send(errorRes(403, "testimonial is required"));


  const newTestimonial = await testimonialModel.create({
   ...body
    
  });
  await newTestimonial.save();

  const newTest = await testimonialModel
  .findById(newTestimonial.id)
  .populate({path:"projects", select:"name locationName locationLink"});

  return res.send(
    successRes(200, `testimonial added successfully: ${title} ${projects}`, {
      data: newTest,
    })
  );
} catch (error) {
  return res.send(errorRes(500, error));
}
};