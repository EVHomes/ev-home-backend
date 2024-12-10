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
  const {
    date,
    place,
    purpose,
    customer,
    project,
    meetingWith,
    summary,
    meetingEnd,
    lead,
    postSaleBooking,
  } = body;

  try {
    // Check for required fields
    if (!date || !place || !purpose || !customer) {
      return res.send(errorRes(403, "All fields are required"));
    }

    const newMeeting = await meetingModel.create({
      ...body,
    });
    const respPayment = await meetingModel
      .find()
      .populate({
        path: "project",
        select: "name",
      })
      .populate({
        path: "place",
        select: "",
      })

      .populate({
        path: "customer",
        select: "-password",
        populate: [
          { path: "projects", select: "name" },
          {
            path: "closingManager",
            select: "firstName lastName",
            populate: [
              { path: "designation" },

              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
        ],
      })

      .populate({
        path: "meetingWith",
        select: "firstName lastName",
        populate: [
          { path: "designation" },

          {
            path: "reportingTo",
            select:"firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "postSaleBooking",
        populate: [
          { path: "project", select: "name" },
          {
            path: "closingManager",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "postSaleExecutive",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
        ],
      })
      .populate({
        path: "lead",
        populate: [
          {
            path: "channelPartner",
            select: "-password -refreshToken",
          },
          {
            path: "project",
            select: "name",
          },
          {
            path: "teamLeader",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "cycle.teamLeader",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "dataAnalyzer",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "preSalesExecutive",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "approvalHistory.employee",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "updateHistory.employee",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "callHistory.caller",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      });
    return res.send(
      successRes(200, `Request sent!`, {
        data: respPayment,
      })
    );
  } catch (error) {
    console.error(error);
    return res.send(
      errorRes(500, "An error occurred while adding the meeting summary")
    );
  }
};
