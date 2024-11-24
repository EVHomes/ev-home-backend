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
    throw new Error(
      "Invalid carry-forward value. It exceeds the maximum possible."
    );
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

export const addNewTarget = async (req, res) => {
  try {
    const { staffId, defaultTarget } = req.body;

    if (!staffId || !defaultTarget) {
      return res
        .status(400)
        .json({ message: "staffId and defaultTarget are required." });
    }

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Check if a target already exists for this month and year
    let target = await TargetModel.findOne({
      staffId,
      month: currentMonth,
      year: currentYear,
    });

    if (!target) {
      // If it doesn't exist, create a new one
      target = await TargetModel.create({
        staffId,
        target: defaultTarget,
        achieved: 0, // No achievements yet
        carryForward: 0, // No carry-forward yet
        month: currentMonth,
        year: currentYear,
      });

      return res.status(201).json({
        message: "New target added for the current month and year.",
        data: target,
      });
    }

    // If target already exists, return it
    return res.status(200).json({
      message: "Target for the current month and year already exists.",
      data: target,
    });
  } catch (error) {
    console.error("Error in /add-target:", error);
    return res.status(500).json({
      message: "An error occurred while adding the target.",
      error: error.message,
    });
  }
};
