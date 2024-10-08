import divisionModel from "../model/division.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getDivision = async (req, res) => {
  try {
    const respDiv = await divisionModel.find();
    return res.send(
      successRes(200, "Get divisions", {
        data: respDiv,
      })
    );
  } catch (error) {
    return res.json({
      message: `error:${error}`,
    });
  }
};

//GET BY ID
export const getDivisionById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respDiv = await divisionModel.findOne({ _id: id });
    if (!respDiv)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respDiv,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//add division
export const addDivision = async (req, res) => {
  const body = req.body;
  const { division } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!division) return res.send(errorRes(403, "division is required"));
    const newDivision = await divisionModel.create({ division: division });
    await newDivision.save();
    return res.send(
      successRes(200, `division added successfully:${division}`, {
        newDivision,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};
