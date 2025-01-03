import { successRes } from "../model/response.js";
import shiftModel from "../model/shift.model.js";

export const getShifts = async (req, res, next) => {
  try {
    const resp = await shiftModel.find();
    return res.send(
      successRes(200, "", {
        data: resp,
      })
    );
  } catch (error) {}
};
