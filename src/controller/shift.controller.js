import moment from "moment";
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
    graceTime,
    gracePeriod,
    multiTimeInOut,
    shiftHours,
    workingHours,
    breakTime,
  } = req.body;

  try {
    if (!shiftName) return res.send(errorRes(401, "Shift Name is required"));
    if (!type) return res.send(errorRes(401, "Shift type is required"));
    if (!timeIn) return res.send(errorRes(401, "timeIn is required"));
    if (!timeOut) return res.send(errorRes(401, "timeOut is required"));

    // Calculate shift hours
    const format = "HH:mm";
    const timeInMoment = moment(timeIn, format);
    const timeOutMoment = moment(timeOut, format);

    // Adjust for shifts that cross midnight
    if (timeOutMoment.isBefore(timeInMoment)) {
      timeOutMoment.add(1, "day");
    }

    const duration = moment.duration(timeOutMoment.diff(timeInMoment));
    const shiftHoursCalculated = duration.asHours();

    // Check if shift already exists
    const oldShift = await shiftModel.findOne({ shiftName });
    if (oldShift) return res.send(errorRes(401, "Shift Already Exist"));

    const newDesgId = "shift-" + shiftName?.replace(/\s+/g, "-").toLowerCase();

    // Create a new shift with calculated shift hours
    const newShift = await shiftModel.create({
      ...req.body,
      _id: newDesgId,
      shiftHours: shiftHours ?? shiftHoursCalculated,
      workingHours: workingHours ?? shiftHoursCalculated,
      breakTime: breakTime ?? 60,
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
    if (!id) return res.send(errorRes(401, "id required"));

    const resp = await shiftModel.findById(id);

    return res.send(
      successRes(200, "get shift", {
        data: resp,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};
