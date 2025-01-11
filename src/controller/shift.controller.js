import { errorRes, successRes } from "../model/response.js";
import shiftModel from "../model/shift.model.js";

export const getShifts = async (req, res, next) => {
  try {
    const resp = await shiftModel.find();

    return res.send(
      successRes(200, "get shifts", {
        data: resp,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const addShift = async (req, res, next) => {
  const {
    shiftName,
    type,
    timeIn,
    timeOut,
    workingHours,
    graceTime,
    status,
    multiTimeInOut,
  } = req.body;

  try {
    
    if (!shiftName) return res.send(errorRes(401, "Shift Name is required"));
    if (type === undefined || type === null)
      return res.send(errorRes(401, "Shift type is required"));
    if (!timeIn) return res.send(errorRes(401, "timeIn is required"));
    if (!timeOut) return res.send(errorRes(401, "timeOut is required"));
    if (!workingHours)
      return res.send(errorRes(401, "workingHours is required"));
    if (!graceTime)
      return res.send(errorRes(401, "graceTime is required"));

    // Check if shift already exists
    const existingShift = await shiftModel.findOne({ shiftName });
    if (existingShift) return res.send(errorRes(401, "Shift Already Exists"));

    // Generate a unique shift ID
    const shiftId = "shift-" + shiftName?.replace(/\s+/g, "-").toLowerCase();

    // Create a new shift
    const newShift = await shiftModel.create({
      _id: shiftId,
      shiftName,
      type,
      timeIn,
      timeOut,
      workingHours,
      graceTime: graceTime ?? 0, 
      status: status ?? true, 
      multiTimeInOut: multiTimeInOut ?? false, 
    });

    return res.send(
      successRes(200, "Shift added", {
        data: newShift,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const getShiftById = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(401, "Shift ID is required"));

    const shift = await shiftModel.findById(id);

    if (!shift) return res.send(errorRes(404, "Shift not found"));

    return res.send(
      successRes(200, "get shift", {
        data: shift,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};
