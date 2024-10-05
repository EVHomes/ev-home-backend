import designationModel from "../model/designation.model.js";

export const getDesignation = async (req, res) => {
  try {
    const respDes= await designationModel.find();

    return res.send(respDes);
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};
