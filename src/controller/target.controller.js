import { errorRes, successRes } from "../model/response.js";
import TargetModel from "../model/target.model.js";

export const upsertTarget = async ({
  staffId,
  target,
  achieved,
  month,
  year,
  carryForward,
}) => {
  const extraAchieved = Math.max(0, achieved - target);
  const maxCarryForward = Math.floor(extraAchieved / 2);

  if (carryForward > maxCarryForward) {
    throw new Error("Invalid carry-forward value. It exceeds the maximum possible.");
  }

  await TargetModel.updateOne(
    { staffId, month, year },
    {
      $set: {
        target,
        achieved,
        extraAchieved,
        carryForward,
        previousCarryForwardUsed: carryForward > 0,
      },
    },
    { upsert: true }
  );
};

export const getCarryForwardOptions = async (staffId, month, year) => {
  const record = await TargetModel.findOne({ staffId, month, year });
  if (!record) throw new Error("Record not found.");

  const { extraAchieved } = record;
  const maxCarryForward = Math.floor(extraAchieved / 2);

  // Generate dropdown options from 0 to maxCarryForward
  return Array.from({ length: maxCarryForward + 1 }, (_, i) => i);
};

export const getMyTarget = async (req, res, next) => {
  try {
    // const user = req.user;
    const id = req.params.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let target = await TargetModel.findOne({
      staffId: id,
      month: currentMonth,
      year: currentYear,
    });

    if (!target) {
      target = await TargetModel.create({
        staffId: id,
        target: 3,
        achieved: 0,
        carryForward: 0,
        month: currentMonth,
        year: currentYear,
      });
    }

    return res.send(successRes(200, "Target Fetched", { data: target }));
  } catch (error) {
    if (error.code === 11000) {
      return res.send(errorRes(409, "Target already exists for this month and year."));
    }

    return res.send(errorRes(500, "Server Error"));
    // return next(error);
  }
};
export const addNewTarget = async (req, res) => {
  try {
    const user = req.user;
    const { staffId = user?._id, defaultTarget = 3 } = req.body;

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Check if a target already exists for this month and year
    let target = await TargetModel.findOne({
      staffId,
      month: currentMonth,
      year: currentYear,
    });

    if (!target) {
      target = await TargetModel.create({
        staffId,
        target: defaultTarget,
        achieved: 0,
        carryForward: 0,
        month: currentMonth,
        year: currentYear,
      });
    }

    return res.send(successRes(200, "Target Fetched", { data: target }));
  } catch (error) {
    if (error.code === 11000) {
      return res.send(errorRes(409, "Target already exists for this month and year."));
    }
    return res.send(errorRes(500, "An error occurred while adding the target"));
  }
};
