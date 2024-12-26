import { errorRes, successRes } from "../model/response.js";
import whatsnewModel from "../model/whats_new_model.js";

export const getWhatsNew = async (req, res) => {
  try {
    const respWhats = await whatsnewModel.find();

    return res.send(
      successRes(200, "Get what's new section", {
        data: respWhats,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addWhatsNew = async (req, res) => {
  const body = req.body;
  const { showCaseImage, imageName } = body;
  try {
    if (!showCaseImage) return res.send(errorRes(400, "Body is required"));

    const newWhatsNew = await whatsnewModel.create({
     ...body
    });
    await newWhatsNew.save();

    return res.send(
      successRes(200, `Whats new images added successfully`, {
        data: newWhatsNew,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};


export const updateWhatsNew = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const {
    imageName,
   showCaseImage
  } = body; // Destructuring the body fields

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!showCaseImage) return res.send(errorRes(403, "Image is required"));

    // console.log(body);
    const updatedWhatsNew = await whatsnewModel.findByIdAndUpdate(
      id, // Find by project ID
      { ...body },
      { new: true } // Return the updated document
    );

    if (!updatedWhatsNew)
      return res.send(errorRes(404, `Project not found with ID: ${id}`));

    // Send a success response
    return res.send(
      successRes(200, `Project updated successfully`, {
        updatedWhatsNew,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};



