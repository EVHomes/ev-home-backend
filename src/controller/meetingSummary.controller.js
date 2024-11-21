import meetingModel from "../model/meetingSummary.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getMeetingSummary = async (req, res) => {
  try {
    const respMe = await meetingModel.find().populate({
      path: "customer",
      select: "-password",
      populate: [
        {
          path: "closingManager",
          select: "-password -refreshToken",
          populate: [
            { path: "designation" },
            { path: "department" },
            { path: "division" },
            {
              path: "reportingTo",
              select: "-password -refreshToken",
              populate: [
                { path: "designation" },
                { path: "department" },
                { path: "division" },
              ],
            },
          ],
        },
      ],
    });

    return res.send(
      successRes(200, "Get Meeting Summary", {
        data: respMe,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addMeetingSummary = async (req, res) => {
  const body = req.body;
  const { date, place, purpose, customer } = body;

  try {
    // Check for required fields
    if (!date || !place || !purpose || !customer) {
      return res.send(errorRes(403, "All fields are required"));
    }

    // Create a new meeting
    const newMeeting = await meetingModel.create({
      date: date,
      place: place,
      purpose: purpose,
      customer: customer,
    });

    // Fetch the updated meeting summary with populated field

    return res.send(
      successRes(200, `Request sent!`, {
        data: newMeeting,
      })
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.send(
      errorRes(500, "An error occurred while adding the meeting summary")
    );
  }
};
