import { validateRequiredLeadsFields } from "../middleware/lead.middleware.js";
import employeeModel from "../model/employee.model.js";
import leadModel from "../model/lead.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import TeamLeaderAssignTurn from "../model/teamLeaderAssignTurn.model.js";
import {
  sendNotificationWithImage,
  sendNotificationWithInfo,
} from "./oneSignal.controller.js";
import { startOfWeek, addDays, format, startOfYear, endOfYear } from "date-fns";

export const getAllLeads = async (req, res, next) => {
  try {
    const today = new Date();
    // const endDate = new Date("2024-10-31T23:59:59.999Z");

    const respLeads = await leadModel
      .find({
        // startDate: { $gte: today },
      })
      .sort({ startDate: -1 })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      // .populate({
      //   path: "viewedBy.employee",
      //   select: "-password -refreshToken",
      //   populate: [
      //     { path: "designation" },
      //     { path: "department" },
      //     { path: "division" },
      //     {
      //       path: "reportingTo",
      //       populate: [
      //         { path: "designation" },
      //         { path: "department" },
      //         { path: "division" },
      //       ],
      //     },
      //   ],
      // })
      .populate({
        path: "approvalHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    if (!respLeads) return res.send(errorRes(404, "No leads found"));
    // console.log("leads sent");
    return res.send(
      successRes(200, "all Leads", {
        data: respLeads,
        // count: respLeads.len,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getLeadsTeamLeader = async (req, res, next) => {
  const teamLeaderId = req.params.id;
  try {
    let query = req.query.query || "";
    let status = req.query.status?.toLowerCase();

    const isNumberQuery = !isNaN(query);

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let statusToFind = null;
    if (status === "visit") {
      statusToFind = { visitStatus: { $ne: "pending" } };
    } else if (status === "revisit") {
      statusToFind = { revisitStatus: { $ne: "pending" } };
    } else if (status === "booking") {
      statusToFind = { bookingStatus: { $ne: "pending" } };
    } else if (status === "followup") {
      statusToFind = { followupStatus: { $ne: "pending" } };
    } else if (status === "pending") {
      statusToFind = {
        $or: [{ visitStatus: "pending" }, { revisitStatus: "pending" }],
      };
    }

    let skip = (page - 1) * limit;
    let searchFilter = {
      ...(statusToFind != null ? statusToFind : null),

      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        isNumberQuery
          ? {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$phoneNumber" },
                  regex: query,
                },
              },
            }
          : null,
        isNumberQuery
          ? {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$altPhoneNumber" },
                  regex: query,
                },
              },
            }
          : null,
        { email: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
        { interestedStatus: { $regex: query, $options: "i" } },
      ].filter(Boolean),
    };

    const respLeads = await leadModel
      .find({
        ...searchFilter,
        teamLeader: teamLeaderId,
      })
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
        path: "callHistory.caller",
        select: "firstName lastName",
        populate: [{ path: "designation" }],
      });

    if (!respLeads) return res.send(errorRes(404, "No leads found"));

    // Count the total items matching the filter
    const totalItems = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
    });

    const contactedCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      contactedStatus: { $ne: "pending" },
    });

    const followUpCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      followupStatus: { $ne: "pending" },
    });

    const assignedCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      preSalesExecutive: { $ne: null },
    });
    const visitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      visitStatus: { $ne: "pending" },
    });

    const revisitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      revisitStatus: { $ne: "pending" },
    });
    const bookingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      bookingStatus: { $ne: "pending" },
    });

    const pendingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      $or: [
        {
          visitStatus: "pending",
        },
        {
          revisitStatus: "pending",
        },
      ],
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "Leads for team Leader", {
        page,
        limit,
        totalPages,
        totalItems,
        pendingCount,
        contactedCount,
        followUpCount,
        assignedCount,
        visitCount,
        revisitCount,
        bookingCount,
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};
export const getLeadTeamLeaderGraph = async (req, res, next) => {
  const teamLeaderId = req.params.id;
  try {
    if (!teamLeaderId) return res.send(errorRes(401, "id Required"));

    const leadCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
      })) || 0;

    const bookingCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
        bookingStatus: { $ne: "pending" },
      })) || 0;

    const visitCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
        visitStatus: { $ne: "pending" },
      })) || 0;

    const revisitCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
        revisitStatus: { $ne: "pending" },
      })) || 0;

    // const leadToVisitCount = leadCount > 0 ? (visitCount * 100) / leadCount : 0;
    // const visitToBookingCount =
    //   visitCount > 0 ? (bookingCount * 100) / visitCount : 0;
    // const revisitToBookingCount =
    //   revisitCount > 0 ? (bookingCount * 100) / revisitCount : 0;
    // const leadToBookingCount =
    //   leadCount > 0 ? (bookingCount * 100) / leadCount : 0;

    return res.send(
      successRes(200, "graphs", {
        data: {
          leadCount,
          bookingCount,
          visitCount,
          revisitCount,
          // leadToVisitCount,
          // visitToBookingCount,
          // revisitToBookingCount,
          // leadToBookingCount,
        },
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error", error));
  }
};

export const getLeadsPreSalesExecutive = async (req, res, next) => {
  const teamLeaderId = req.params.id;
  try {
    let query = req.query.query || "";
    let status = req.query.status;

    const isNumberQuery = !isNaN(query);

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let statusToFind = null;
    /*if (status === "visit-done") {
      statusToFind = { "visitStage.status": "done" };
    } else if (status === "revisit-done") {
      statusToFind = { "revisitStage.status": "done" };
    } else if (status === "booking") {
      statusToFind = { "bookingStage.status": "booked" };
    } else */ if (status === "followup") {
      statusToFind = { stage: "followup" };
    }

    let skip = (page - 1) * limit;
    let searchFilter = {
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        isNumberQuery
          ? {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$phoneNumber" },
                  regex: query,
                },
              },
            }
          : null,
        isNumberQuery
          ? {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$altPhoneNumber" },
                  regex: query,
                },
              },
            }
          : null,
        { email: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
        statusToFind != null ? statusToFind : null,
        { interestedStatus: { $regex: query, $options: "i" } },
      ].filter(Boolean),
    };

    const respLeads = await leadModel
      .find({
        ...searchFilter,
        preSalesExecutive: teamLeaderId,
      })
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "project",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      // .populate({
      //   path: "viewedBy.employee",
      //   select: "-password -refreshToken",
      //   populate: [
      //     { path: "designation" },
      //     { path: "department" },
      //     { path: "division" },
      //     {
      //       path: "reportingTo",
      //       populate: [
      //         { path: "designation" },
      //         { path: "department" },
      //         { path: "division" },
      //       ],
      //     },
      //   ],
      // })
      .populate({
        path: "approvalHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    if (!respLeads) return res.send(errorRes(404, "No leads found"));

    // Count the total items matching the filter
    const totalItems = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
    });
    const pendingCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      status: "Pending",
    });

    const contactedCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      status: "Contacted",
    });

    const followUpCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      status: "FollowUp",
    });

    const assignedCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
    });

    const visitCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      "visitStage.status": "done",
    });
    const revisitCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      "revisitStage.status": "done",
    });
    const bookingCount = await leadModel.countDocuments({
      preSalesExectuive: { $eq: teamLeaderId },
      "bookingStage.status": "booked",
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "Leads for team Leader", {
        page,
        limit,
        totalPages,
        totalItems,
        pendingCount,
        contactedCount,
        followUpCount,
        assignedCount,
        visitCount,
        revisitCount,
        bookingCount,
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const searchLeads = async (req, res, next) => {
  try {
    let query = req.query.query || "";
    let approvalStatus = req.query.approvalStatus?.toLowerCase();
    let stage = req.query.stage?.toLowerCase();
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);

    let orFilters = [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
    ];

    if (isNumberQuery) {
      orFilters.push(
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$phoneNumber" },
              regex: query,
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$altPhoneNumber" },
              regex: query,
            },
          },
        }
      );
    }

    orFilters.push(
      { email: { $regex: query, $options: "i" } },
      { address: { $regex: query, $options: "i" } },
      { interestedStatus: { $regex: query, $options: "i" } }
    );

    let searchFilter = {
      $or: orFilters,
      ...(approvalStatus && {
        approvalStatus: { $regex: approvalStatus, $options: "i" },
      }),
      ...(stage ? { stage: stage } : { stage: { $ne: "tagging-over" } }),
    };

    // Execute the search with the refined filter
    const respCP = await leadModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
        path: "callHistory.caller",
        select: "firstName lastName",
        populate: [{ path: "designation" }],
      });

    // Count the total items matching the filter
    // const totalItems = await leadModel.countDocuments(searchFilter);
    // Count the total items matching the filter
    const totalItems = await leadModel.countDocuments({
      stage: { $ne: "tagging-over" },
    });
    // const totalItems = await leadModel.countDocuments(searchFilter);
    const rejectedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "rejected" },
        { stage: { $ne: "tagging-over" } },
      ],
    });

    const pendingCount = await leadModel.countDocuments({
      $and: [{ approvalStatus: "pending" }, { stage: { $ne: "tagging-over" } }],
    });

    const approvedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "approved" },
        { stage: { $ne: "tagging-over" } },
      ],
    });

    // const assignedCount = await leadModel.countDocuments({
    //   $and: [{ preSalesExecutive: { $ne: null } }],
    // });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);
    // cons;
    return res.send(
      successRes(200, "get leads", {
        page,
        limit,
        totalPages,
        totalItems,
        pendingCount,
        approvedCount,
        // assignedCount,
        rejectedCount,
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respLead = await leadModel
      .findById(id)
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      // .populate({
      //   path: "viewedBy.employee",
      //   select: "-password -refreshToken",
      //   populate: [
      //     { path: "designation" },
      //     { path: "department" },
      //     { path: "division" },
      //     {
      //       path: "reportingTo",
      //       populate: [
      //         { path: "designation" },
      //         { path: "department" },
      //         { path: "division" },
      //       ],
      //     },
      //   ],
      // })
      .populate({
        path: "approvalHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    if (!respLead) return errorRes(404, "No lead found");

    return res.send(
      successRes(200, "lead by id", {
        data: respLead,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getSimilarLeadsById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respLead = await leadModel.findById(id);

    if (!respLead) return errorRes(404, "No lead found");

    const similarLeads = await leadModel
      .find({
        $and: [
          {
            $or: [
              { phoneNumber: respLead.phoneNumber },
              { altPhoneNumber: respLead.phoneNumber },
            ],
          },
          { _id: { $ne: id } },
        ],
      })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "approvalHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    return res.send(
      successRes(200, "Similar Leads", {
        data: similarLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addLead = async (req, res, next) => {
  const body = req.filteredBody;
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    altPhoneNumber,
    remark,
    startDate,
    channelPartner, // Channel Partner ID
    teamLeader,
    preSalesExecutive,
    validTill,
    status,
    requirement,
    project,
    interestedStatus,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    const validFields = validateRequiredLeadsFields(body);

    if (!validFields.isValid) {
      return res.send(errorRes(400, validFields.message));
    }

    const currentDate = new Date();
    const ninetyOneDaysAgo = new Date(currentDate);
    ninetyOneDaysAgo.setDate(currentDate.getDate() - 91);

    const sixtyDaysAgo = new Date(currentDate);
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Condition 1: Check if the same CP is trying to create the same lead within 91 days
    if (channelPartner) {
      const existingLeadForCP = await leadModel.findOne({
        phoneNumber: phoneNumber,
        channelPartner: channelPartner,
        startDate: {
          $gte: ninetyOneDaysAgo,
          $lte: currentDate,
        },
      });

      if (existingLeadForCP) {
        return res.send(
          errorRes(
            409,
            `You cannot create the same lead with phone number ${phoneNumber} within 91 days.`
          )
        );
      }
    }

    // Condition 2: Check if a different CP created a lead with the same phone number within 60 days
    const existingLeadForOtherCP = await leadModel.findOne({
      phoneNumber: phoneNumber,
      channelPartner: { $ne: channelPartner }, // Other CPs
      startDate: {
        $gte: sixtyDaysAgo,
        $lte: currentDate,
      },
    });

    if (existingLeadForOtherCP) {
      const newLead = await leadModel.create({ ...body });
      const dataAnalyser = await employeeModel
        .find({
          designation: "desg-data-analyzer",
        })
        .sort({ createdAt: 1 });

      const getIds = dataAnalyser.map((dt) => dt._id.toString());
      const foundTLPlayerId = await oneSignalModel.find({
        docId: { $in: getIds },
        role: "employee",
      });

      if (foundTLPlayerId.length > 0) {
        // console.log(foundTLPlayerId);
        const getPlayerIds = foundTLPlayerId.map((dt) => dt.playerId);

        await sendNotificationWithInfo({
          playerIds: getPlayerIds,
          title: "You've Got a New Lead!",
          message: `A new lead is now available for you to review. Please check the details and take the required steps to approve or update it`,
        });
      }

      return res.send(
        successRes(
          201,
          `Lead created successfully, but the same client lead exists with another channel partner.`,
          {
            existingLead: existingLeadForOtherCP,
            data: newLead,
          }
        )
      );
    }

    // Condition 3: If no existing lead exists, create a new one
    const newLead = await leadModel.create({ ...body });

    const dataAnalyser = await employeeModel
      .find({
        designation: "desg-data-analyzer",
      })
      .sort({ createdAt: 1 });

    const getIds = dataAnalyser.map((dt) => dt._id.toString());
    const foundTLPlayerId = await oneSignalModel.find({
      docId: { $in: getIds },
      role: "employee",
    });

    if (foundTLPlayerId.length > 0) {
      // console.log(foundTLPlayerId);
      const getPlayerIds = foundTLPlayerId.map((dt) => dt.playerId);

      await sendNotificationWithInfo({
        playerIds: getPlayerIds,
        title: "You've Got a New Lead!",
        message: `A new lead is now available for you to review. Please check the details and take the required steps to approve or update it`,
      });
    }

    return res.send(
      successRes(200, `Lead added successfully: ${firstName} ${lastName}`, {
        data: newLead,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updateLead = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  const user = req.user;
  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!body) return res.send(errorRes(403, "Data is required"));

    const { remark } = body;

    // if (!email) return res.send(errorRes(403, "Email is required"));
    // if (!firstName) return res.send(errorRes(403, "First name is required"));
    // if (!lastName) return res.send(errorRes(403, "Last name is required"));
    // if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));
    // if (!status) return res.send(errorRes(403, "Status is required"));
    // if (!interestedStatus)
    //   return res.send(errorRes(403, "Interested status is required"));
    // if (!remark) return res.send(errorRes(403, "Remark is required"));

    // Update the lead by ID
    const updatedLead = await leadModel.findByIdAndUpdate(
      id,
      {
        ...body,
        $addToSet: {
          updateHistory: {
            employee: user?._id,
            changes: `${JSON.stringify(body)}`,
            updatedAt: Date.now(),
            remark: remark,
          },
        },
      },
      { new: true }
    );

    // Check if the lead was updated successfully
    if (!updatedLead)
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));

    return res.send(
      successRes(200, `Lead updated successfully`, {
        data: updatedLead,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const rejectLeadById = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  const user = req.user;
  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!body) return res.send(errorRes(403, "Data is required"));

    const { remark } = body;

    // Update the lead by ID
    const updatedLead = await leadModel.findByIdAndUpdate(
      id,
      {
        ...body,
        $set: {
          approvalStage: {
            status: "Rejected",
            date: new Date(),
            remark: remark ?? "Rejected",
          },
        },
        $addToSet: {
          approvalHistory: {
            employee: user?._id,
            approvedAt: new Date(),
            remark: remark ?? "Rejected",
          },
          updateHistory: {
            employee: user?._id,
            changes: `Lead Rejected`,
            updatedAt: new Date(),
            remark: remark,
          },
        },
      },
      { new: true }
    );

    return res.send(
      successRes(200, `Lead Rejected Successfully`, {
        data: updatedLead,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};
export const deleteLead = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));

    // Attempt to delete the lead by ID
    const deletedLead = await leadModel.findByIdAndDelete(id);

    // Check if the lead was found and deleted
    if (!deletedLead)
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));

    return res.send(
      successRes(200, `Lead deleted successfully with ID: ${id}`, {
        deletedLead,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const LeadAssignToTeamLeader = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;

  const { remark, teamLeaderId } = req.body;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    if (!teamLeaderId)
      return res.send(errorRes(403, "teamLeaderId is required"));

    const respLead = await leadModel.findById(id);

    if (!respLead) return res.send(errorRes(404, "No lead found"));

    const teamLeaderResp = await employeeModel.find({ _id: teamLeaderId });

    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        {
          teamLeader: teamLeaderId,
          dataAnalyser: user?._id,
          approvalStatus: "approved",
          approvalRemark: remark ?? "approved",
          approvalDate: new Date(),
          $addToSet: {
            approvalHistory: {
              employee: user?._id,
              approvedAt: new Date(),
              remark: remark ?? "approved",
            },
            updateHistory: {
              employee: user?._id,
              changes: `Lead Assign to Team Leader ${teamLeaderResp?.firstName} ${teamLeaderResp?.lastName}`,
              updatedAt: new Date(),
              remark: remark,
            },
          },
        },
        { new: true, runValidators: true }
      )
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    const foundTLPlayerId = await oneSignalModel.findOne({
      docId: teamLeaderResp?._id,
      role: teamLeaderResp?.role,
    });

    console.log("pass 3");
    if (foundTLPlayerId) {
      // console.log(foundTLPlayerId);
      await sendNotificationWithImage({
        playerIds: [foundTLPlayerId.playerId],
        title: "You've Got a New Lead!",
        message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
        imageUrl:
          "https://img.freepik.com/premium-vector/checklist-with-check-marks-pencil-envelope-list-notepad_1280751-82597.jpg?w=740",
      });
    }
    console.log("pass 4");

    return res.send(
      successRes(200, "Lead Assigned Successfully", { data: updatedLead })
    );
  } catch (error) {
    return next(error);
  }
};
export const assignLeadToTeamLeader = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;

  const { remark } = req.body;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    const respLead = await leadModel.findById(id);
    if (!respLead) return res.send(errorRes(404, "No lead found"));

    if (respLead.teamLeader) {
      if (respLead.approvalStatus != "Approved") {
        const updatedLead = await leadModel
          .findByIdAndUpdate(
            id,
            {
              dataAnalyser: user?._id,
              approvalStatus: "Approved",
              $addToSet: {
                approvalHistory: {
                  employee: user?._id,
                  approvedAt: Date.now(),
                  remark: remark ?? "Approved",
                },
                updateHistory: {
                  employee: user?._id,
                  changes: `Lead Approved`,
                  updatedAt: Date.now(),
                  remark: remark,
                },
              },
            },
            { new: true, runValidators: true }
          )
          .populate({
            path: "channelPartner",
            select: "-password -refreshToken",
          })
          .populate({
            path: "teamLeader",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          })
          .populate({
            path: "dataAnalyzer",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          })
          .populate({
            path: "preSalesExecutive",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          })
          .populate({
            path: "viewedBy.employee",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          })
          .populate({
            path: "approvalHistory.employee",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          })
          .populate({
            path: "updateHistory.employee",
            select: "-password -refreshToken",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
              {
                path: "reportingTo",
                populate: [
                  { path: "designation" },
                  { path: "department" },
                  { path: "division" },
                ],
              },
            ],
          });

        return res.send(
          successRes(200, `Lead is Approved`, {
            data: updatedLead,
          })
        );
      }
      return res.send(errorRes(401, "Team Leader is Already Assigned"));
    }

    const teamLeaders = await employeeModel
      .find({
        $or: [
          { designation: "desg-senior-closing-manager" },
          { designation: "desg-site-head" },
        ],
        status: "active",
      })
      .sort({ createdAt: 1 });

    const whichTurn = await TeamLeaderAssignTurn.findOne({});

    // console.log(teamLeaders);

    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        {
          teamLeader: teamLeaders[whichTurn?.currentOrder]?._id,
          dataAnalyser: user?._id,
          approvalStatus: "Approved",
          $addToSet: {
            approvalHistory: {
              employee: user?._id,
              approvedAt: Date.now(),
              remark: remark ?? "Approved",
            },
            updateHistory: {
              employee: user?._id,
              changes: `Lead Assign to Team Leader ${
                teamLeaders[whichTurn?.currentOrder].firstName
              } ${teamLeaders[whichTurn?.currentOrder].lastName}`,
              updatedAt: Date.now(),
              remark: remark,
            },
          },
        },
        { new: true, runValidators: true }
      )
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      // .populate({
      //   path: "viewedBy.employee",
      //   select: "-password -refreshToken",
      //   populate: [
      //     { path: "designation" },
      //     { path: "department" },
      //     { path: "division" },
      //     {
      //       path: "reportingTo",
      //       populate: [
      //         { path: "designation" },
      //         { path: "department" },
      //         { path: "division" },
      //       ],
      //     },
      //   ],
      // })
      .populate({
        path: "approvalHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
        ],
      });

    const foundTLPlayerId = await oneSignalModel.findOne({
      docId: teamLeaders[whichTurn?.currentOrder]?._id,
      role: teamLeaders[whichTurn?.currentOrder]?.role,
    });

    if (foundTLPlayerId) {
      // console.log(foundTLPlayerId);
      await sendNotificationWithInfo({
        playerIds: [foundTLPlayerId.playerId],
        title: "You've Got a New Lead!",
        message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
      });
    }
    let nextOrder = whichTurn?.currentOrder + 1;

    // Reset to 0 if nextOrder exceeds the length of teamLeaders
    if (nextOrder >= teamLeaders.length) {
      nextOrder = 0;
    }
    // Update the currentOrder in the database
    await whichTurn.updateOne({
      lastAssignTeamLeader: teamLeaders[whichTurn?.currentOrder]?._id,
      nextAssignTeamLeader: teamLeaders[nextOrder]?._id,
      currentOrder: nextOrder,
    });

    return res.send(
      successRes(
        200,
        `lead assigned to ${teamLeaders[whichTurn?.currentOrder].firstName} ${
          teamLeaders[whichTurn?.currentOrder].lastName
        }`,
        {
          data: updatedLead,
        }
      )
    );
  } catch (error) {
    // console.log("got error" + error?.message);

    next(error);
  }
};

export const assignLeadToPreSaleExecutive = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;
  const { remark, assignTo } = req.body;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    const respLead = await leadModel.findById(id);

    if (!respLead) return res.send(errorRes(404, "No lead found"));

    if (respLead.preSalesExecutive)
      return res.send(errorRes(401, "Pre Sale Executive is Already Assigned"));

    const preSalesExecutive = await employeeModel.findById(assignTo);

    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        {
          preSalesExecutive: assignTo,
          $addToSet: {
            updateHistory: {
              employee: user?._id,
              changes: `Lead Assign to Presale Executive ${preSalesExecutive.firstName} ${preSalesExecutive.lastName}`,
              updatedAt: Date.now(),
              remark: remark,
            },
          },
        },
        { new: true, runValidators: true }
      )
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
        populate: [
          { path: "designation" },
          { path: "department" },
          { path: "division" },
          {
            path: "reportingTo",
            populate: [
              { path: "designation" },
              { path: "department" },
              { path: "division" },
            ],
          },
        ],
      });

    const foundTLPlayerId = await oneSignalModel.findOne({
      docId: assignTo,
      role: preSalesExecutive.role,
    });

    if (foundTLPlayerId) {
      // console.log(foundTLPlayerId);
      await sendNotificationWithInfo({
        playerIds: [foundTLPlayerId.playerId],
        title: "New Lead Assigned!",
        message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
      });
    }

    return res.send(
      successRes(
        200,
        `Lead Assign to Presale Executive ${preSalesExecutive.firstName} ${preSalesExecutive.lastName}`,
        {
          data: updatedLead,
        }
      )
    );
  } catch (error) {
    // console.log("got error" + error?.message);

    next(error);
  }
};

export const updateCallHistoryByPreSaleExcutive = async (req, res, next) => {
  const { callerId, remark, feedback, documentUrl, recordingUrl } = req.body;
  try {
    const updatedLead = await leadModel.findByIdAndUpdate(
      leadId,
      {
        $push: {
          callHistory: {
            caller: callerId,
            remark: remark,
            feedback: feedback,
            document: documentUrl,
            recording: recordingUrl,
          },
        },
      },
      { new: true }
    );
  } catch (error) {}
};

export const updateCallHistoryPreSales = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const user = req.user;

  const {
    leadStage,
    leadStatus,
    feedback,
    siteVisit,
    documentUrl,
    recordingUrl,
  } = body;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    if (!leadStage) return res.send(errorRes(403, "Lead Stage is required"));
    if (!leadStatus) return res.send(errorRes(403, "Lead Status is required"));
    if (!feedback) return res.send(errorRes(403, "Feedback is required"));
    if (!siteVisit) return res.send(errorRes(403, "Site Visit is required"));

    // Update the lead with call history details
    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        {
          status: leadStage,
          $push: {
            callHistory: {
              caller: user._id,
              stage: leadStage, // Include leadStage
              status: leadStatus, // Include leadStatus
              feedback: feedback,
              siteVisit: siteVisit, // Include siteVisit
              document: documentUrl, // Store the document URL
              recording: recordingUrl, // Store the recording URL
            },
          },
        },
        { new: true }
      )
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })

      .populate({
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
      })
      .populate({
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
      })
      .populate({
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
      })
      .populate({
        path: "callHistory.caller",
        select: "firstName lastName",
        populate: [{ path: "designation" }],
      });
    if (!updatedLead) {
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));
    }

    return res.send(
      successRes(200, `Caller updated successfully: ${id}`, {
        updatedLead,
      })
    );
  } catch (error) {
    console.error("Error updating call history:", error);
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const markLeadAsApproved = async (leadId, employeeId, remark) => {
  try {
    const updatedLead = await leadModel.findByIdAndUpdate(
      leadId,
      {
        $addToSet: {
          approvalHistory: {
            employee: employeeId,
            approvedAt: Date.now(),
            remark: remark,
          },
        },
      },
      { new: true }
    );

    return updatedLead;
  } catch (error) {
    console.error("Error marking lead as approved:", error);
    throw new Error("Could not mark lead as approved");
  }
};

export const updateLeadDetails = async (leadId, employeeId, changes) => {
  try {
    const updatedLead = await leadModel.findByIdAndUpdate(
      leadId,
      {
        $addToSet: {
          updateHistory: {
            employee: employeeId,
            updatedAt: Date.now(),
            changes: changes,
          },
        },
      },
      { new: true }
    );

    return updatedLead;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw new Error("Could not update lead");
  }
};

//not needed right now
export const checkLeadsExists = async (req, res, next) => {
  const { phoneNumber, altPhoneNumber } = req.params;
  try {
    // if (!phoneNumber)
    //   return res.send(errorRes(403, "Phone Number is required"));
    const today = new Date(); // Get today's date

    const existingLead = await leadModel.find({
      // $or: [
      //   {
      //     phoneNumber: phoneNumber,
      //   },
      //   {
      //     altPhoneNumber: phoneNumber,
      //   },
      // ],
      startDate: { $gt: today },
    });
    // if (existingLead) {
    //   return res.send(
    //     errorRes(
    //       409,
    //       `Lead already exists with phone number: ${
    //         (phoneNumber, altPhoneNumber)
    //       }`
    //     )
    //   ); // 409 Conflict
    // }

    // If no lead exists, you can return a success response or proceed with the next operation
    return res.send({
      code: 200,
      data: existingLead,
      length: existingLead.length,
      message: "No lead found with this phone number. You can proceed.",
    });
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export async function getLeadCounts(req, res, next) {
  try {
    const { interval = "monthly", year, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();

    // Validate year parameter only if it's provided
    let selectedYear = currentYear;
    if (year) {
      selectedYear = parseInt(year, 10);
      if (isNaN(selectedYear)) {
        return res.status(400).json({ message: "Invalid year parameter" });
      }
    }

    // Calculate the start of the current week (Monday)
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 7); // Limit to current week (Mon-Sun)

    let matchStage = {};

    if (interval === "weekly") {
      matchStage = {
        startDate: {
          $gte: startOfCurrentWeek,
          $lt: endOfCurrentWeek,
        },
      };
    } else if (interval === "monthly") {
      if (startDate && endDate) {
        matchStage = {
          startDate: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        };
      } else {
        matchStage = {
          startDate: {
            $gte: new Date(`${selectedYear}-01-01`),
            $lt: new Date(`${selectedYear + 1}-01-01`),
          },
        };
      }
    } else {
      return res.status(400).json({ message: "Invalid interval parameter" });
    }

    let groupStage = {};
    if (interval === "weekly") {
      groupStage = {
        _id: {
          dayOfWeek: { $dayOfWeek: "$startDate" },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { "_id.date": 1, "_id.month": 1, "_id.dayOfWeek": 1 } },
    ]);

    // Prepare a full weekly structure with zero counts for missing days
    const dayMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startOfCurrentWeek, i);
      return {
        date: format(date, "yyyy-MM-dd"),
        day: dayMap[(i + 1) % 7], // Adjust for MongoDB's $dayOfWeek (1 = Sunday)
        count: 0,
      };
    });

    // Populate `weekData` with actual counts where available
    leadCounts.forEach((item) => {
      const foundDay = weekData.find((day) => day.date === item._id.date);
      if (foundDay) foundDay.count = item.count;
    });

    if (interval === "weekly") {
      return res.json(weekData); // Only send weekly data with all days accounted for
    }

    // Monthly data output
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonthlyData = leadCounts.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1], // Use month number to get month name
      count: item.count,
    }));

    return res.send(
      successRes(200, "ok", {
        data: formattedMonthlyData,
      })
    );
  } catch (error) {
    console.error("Error getting lead counts:", error);
    next(error);
  }
}

export async function getLeadCountsByTeamLeaders(req, res, next) {
  try {
    const { interval = "monthly", year, month, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

    // Validate and set selected year
    let selectedYear = year ? parseInt(year, 10) : currentYear;
    if (isNaN(selectedYear)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    // Validate and set selected month
    let selectedMonth = month ? parseInt(month, 10) : currentMonth;
    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    let matchStage = {};

    if (interval === "monthly") {
      const startOfMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonthDate = new Date(selectedYear, selectedMonth, 1);
      matchStage.startDate = {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      };
    } else if (interval === "weekly") {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6); // 6 days for a full week
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "quarterly") {
      const quarter = Math.ceil(selectedMonth / 3);
      const startOfQuarter = new Date(selectedYear, (quarter - 1) * 3, 1);
      const endOfQuarter = new Date(selectedYear, quarter * 3, 1);
      matchStage.startDate = {
        $gte: startOfQuarter,
        $lt: endOfQuarter,
      };
    } else if (interval === "semi-annually") {
      const isFirstHalf = selectedMonth <= 6;
      const startOfHalf = new Date(selectedYear, isFirstHalf ? 0 : 6, 1);
      const endOfHalf = new Date(selectedYear, isFirstHalf ? 6 : 12, 1);
      matchStage.startDate = {
        $gte: startOfHalf,
        $lt: endOfHalf,
      };
    } else if (interval === "yearly" || interval === "annually") {
      matchStage.startDate = {
        $gte: startOfYear(new Date(selectedYear, 0, 1)),
        $lt: endOfYear(new Date(selectedYear, 11, 31)),
      };
    } else if (interval === "custom" && startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    } else {
      return res
        .status(400)
        .json({ message: "Invalid interval or date range parameter" });
    }

    // Group stage and further aggregation logic for each interval
    let groupStage = {};
    if (interval === "weekly") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
          week: { $week: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "quarterly") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
          quarter: {
            $ceil: { $divide: [{ $month: "$startDate" }, 3] },
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "semi-annually") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
          half: {
            $cond: [{ $lte: [{ $month: "$startDate" }, 6] }, "H1", "H2"],
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "yearly" || interval === "annually") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "custom") {
      groupStage = {
        _id: {
          teamLeader: "$teamLeader",
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $lookup: {
          from: "employees",
          localField: "_id.teamLeader",
          foreignField: "_id",
          as: "teamLeaderDetails",
        },
      },
      { $unwind: "$teamLeaderDetails" },
      {
        $project: {
          teamLeader: {
            $concat: [
              "$teamLeaderDetails.firstName",
              " ",
              "$teamLeaderDetails.lastName",
            ],
          },
          count: 1,
          interval,
          year: "$_id.year",
          ...(interval === "monthly" && {
            month: {
              $let: {
                vars: {
                  months: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                in: { $arrayElemAt: ["$$months", "$_id.month"] },
              },
            },
          }),
          ...(interval === "quarterly" && { quarter: "$_id.quarter" }),
          ...(interval === "semi-annually" && { half: "$_id.half" }),
        },
      },
      { $sort: { count: -1 } },
    ]);

    const responseData = leadCounts.map((item) => ({
      teamLeader: item.teamLeader,
      count: item.count,
      interval: item.interval,
      year: item.year,
      month: item.month,
      quarter: item.quarter,
      half: item.half,
    }));

    return res.send(successRes(200, "ok", { data: responseData }));
  } catch (error) {
    console.error("Error getting unique team leader lead counts:", error);
    next(error);
  }
}

export async function getAllLeadCountsFunnel(req, res, next) {
  try {
    const { interval = "yearly", year, month, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Set and validate year and month
    let selectedYear = year ? parseInt(year, 10) : currentYear;
    let selectedMonth = month ? parseInt(month, 10) : currentMonth;

    if (
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      return res
        .status(400)
        .json({ message: "Invalid year or month parameter" });
    }

    // Define match stage
    let matchStage = {};

    if (interval === "monthly") {
      const startOfMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonthDate = new Date(selectedYear, selectedMonth, 1);
      matchStage.startDate = {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      };
    } else if (interval === "weekly") {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "quarterly") {
      const quarter = Math.floor((selectedMonth - 1) / 3);
      const startOfQuarterDate = new Date(selectedYear, quarter * 3, 1);
      const endOfQuarterDate = new Date(selectedYear, (quarter + 1) * 3, 1);
      matchStage.startDate = {
        $gte: startOfQuarterDate,
        $lt: endOfQuarterDate,
      };
    } else if (interval === "semi-annually") {
      const half = Math.floor((selectedMonth - 1) / 6);
      const startOfHalfDate = new Date(selectedYear, half * 6, 1);
      const endOfHalfDate = new Date(selectedYear, (half + 1) * 6, 1);
      matchStage.startDate = {
        $gte: startOfHalfDate,
        $lt: endOfHalfDate,
      };
    } else if (interval === "yearly" || interval === "annually") {
      matchStage.startDate = {
        $gte: new Date(selectedYear, 0, 1),
        $lt: new Date(selectedYear + 1, 0, 1),
      };
    } else if (interval === "custom" && startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    } else {
      return res
        .status(400)
        .json({ message: "Invalid interval or date range parameter" });
    }

    // Define all possible statuses for the funnel
    const allStatuses = [
      "booked",
      "site visit",
      "Supposed to Site Visit",
      "approved",
      "rejected",
    ];

    // Group stage by lead status and interval
    let groupStage = {
      _id: { status: "$status" },
      count: { $sum: 1 },
    };

    if (interval === "weekly") {
      groupStage._id.week = { $week: "$startDate" };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "monthly") {
      groupStage._id.month = { $month: "$startDate" };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "quarterly") {
      groupStage._id.quarter = {
        $ceil: { $divide: [{ $month: "$startDate" }, 3] },
      };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "semi-annually") {
      groupStage._id.half = {
        $ceil: { $divide: [{ $month: "$startDate" }, 6] },
      };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "yearly" || interval === "annually") {
      groupStage._id.year = { $year: "$startDate" };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $project: {
          status: "$_id.status",
          count: 1,
          interval,
          year: "$_id.year",
          month: {
            $let: {
              vars: {
                months: [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          week: "$_id.week",
          quarter: "$_id.quarter",
          half: "$_id.half",
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Map lead counts to allStatuses to ensure each status is represented
    const responseData = allStatuses.map((status) => {
      const found = leadCounts.find((item) => item.status === status);
      return {
        status,
        count: found ? found.count : 0,
        interval,
        year: found ? found.year : selectedYear,
        month: found
          ? found.month
          : interval === "monthly"
          ? currentMonth
          : undefined,
        week: found ? found.week : undefined,
        quarter: found ? found.quarter : undefined,
        half: found ? found.half : undefined,
      };
    });

    return res.send(successRes(200, "ok", { data: responseData }));
  } catch (error) {
    console.error("Error getting all lead counts by status:", error);
    next(error);
  }
}

export async function getLeadCountsByChannelPartner(req, res, next) {
  try {
    const { interval = "monthly", year, month, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

    // Validate and set selected year
    let selectedYear = year ? parseInt(year, 10) : currentYear;
    if (isNaN(selectedYear)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    // Validate and set selected month
    let selectedMonth = month ? parseInt(month, 10) : currentMonth;
    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    let matchStage = {};

    if (interval === "monthly") {
      const startOfMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonthDate = new Date(selectedYear, selectedMonth, 1);
      matchStage.startDate = {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      };
    } else if (interval === "weekly") {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6); // 6 days for a full week
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "quarterly") {
      const quarter = Math.ceil(selectedMonth / 3);
      const startOfQuarter = new Date(selectedYear, (quarter - 1) * 3, 1);
      const endOfQuarter = new Date(selectedYear, quarter * 3, 1);
      matchStage.startDate = {
        $gte: startOfQuarter,
        $lt: endOfQuarter,
      };
    } else if (interval === "semi-annually") {
      const isFirstHalf = selectedMonth <= 6;
      const startOfHalf = new Date(selectedYear, isFirstHalf ? 0 : 6, 1);
      const endOfHalf = new Date(selectedYear, isFirstHalf ? 6 : 12, 1);
      matchStage.startDate = {
        $gte: startOfHalf,
        $lt: endOfHalf,
      };
    } else if (interval === "yearly" || interval === "annually") {
      matchStage.startDate = {
        $gte: startOfYear(new Date(selectedYear, 0, 1)),
        $lt: endOfYear(new Date(selectedYear, 11, 31)),
      };
    } else if (interval === "custom" && startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    } else {
      return res
        .status(400)
        .json({ message: "Invalid interval or date range parameter" });
    }

    // Group stage and further aggregation logic for each interval
    let groupStage = {};
    if (interval === "weekly") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
          week: { $week: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "quarterly") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
          quarter: {
            $ceil: { $divide: [{ $month: "$startDate" }, 3] },
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "semi-annually") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
          half: {
            $cond: [{ $lte: [{ $month: "$startDate" }, 6] }, "H1", "H2"],
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "yearly" || interval === "annually") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "custom") {
      groupStage = {
        _id: {
          channelPartner: "$channelPartner",
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $lookup: {
          from: "channelPartners",
          localField: "_id.channelPartner",
          foreignField: "_id",
          as: "channelPartnerDetails",
        },
      },
      { $unwind: "$channelPartnerDetails" },
      {
        $project: {
          channelPartner: "$channelPartnerDetails.firmName",
          count: 1,
          interval,
          year: "$_id.year",
          ...(interval === "monthly" && {
            month: {
              $let: {
                vars: {
                  months: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                in: { $arrayElemAt: ["$$months", "$_id.month"] },
              },
            },
          }),
          ...(interval === "quarterly" && { quarter: "$_id.quarter" }),
          ...(interval === "semi-annually" && { half: "$_id.half" }),
        },
      },
      { $sort: { count: -1 } },
    ]);

    const responseData = leadCounts.map((item) => ({
      channelPartner: item.channelPartner,
      count: item.count,
      interval: item.interval,
      year: item.year,
      month: item.month,
      quarter: item.quarter,
      half: item.half,
    }));

    return res.send(successRes(200, "ok", { data: responseData }));
  } catch (error) {
    console.error("Error getting unique team leader lead counts:", error);
    next(error);
  }
}

//for pre sale team leader
export async function getLeadCountsByTeamLeader(req, res, next) {
  try {
    const teamLeaderId = req.params.id;
    const { interval = "monthly", year, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();

    // Validate teamLeaderId parameter
    if (!teamLeaderId) {
      return res.status(400).json({ message: "Team leader ID is required" });
    }

    // Validate year parameter only if it's provided
    let selectedYear = currentYear;
    if (year) {
      selectedYear = parseInt(year, 10);
      if (isNaN(selectedYear)) {
        return res.status(400).json({ message: "Invalid year parameter" });
      }
    }

    // Calculate the start of the current week (Monday)
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 7); // Limit to current week (Mon-Sun)

    let matchStage = {
      teamLeader: teamLeaderId, // Match by team leader ID
    };

    if (interval === "weekly") {
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "monthly") {
      if (startDate && endDate) {
        matchStage.startDate = {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        };
      } else {
        matchStage.startDate = {
          $gte: new Date(`${selectedYear}-01-01`),
          $lt: new Date(`${selectedYear + 1}-01-01`),
        };
      }
    } else {
      return res.status(400).json({ message: "Invalid interval parameter" });
    }

    let groupStage = {};
    if (interval === "weekly") {
      groupStage = {
        _id: {
          dayOfWeek: { $dayOfWeek: "$startDate" },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { "_id.date": 1, "_id.month": 1, "_id.dayOfWeek": 1 } },
    ]);

    // Prepare a full weekly structure with zero counts for missing days
    const dayMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let weekData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startOfCurrentWeek, i);
      return {
        date: format(date, "yyyy-MM-dd"),
        day: dayMap[(i + 1) % 7], // Adjust for MongoDB's $dayOfWeek (1 = Sunday)
        count: 0,
      };
    });

    // Populate `weekData` with actual counts where available
    leadCounts.forEach((item) => {
      const foundDay = weekData.find((day) => day.date === item._id.date);
      if (foundDay) foundDay.count = item.count;
    });

    if (interval === "weekly") {
      return res.json(weekData); // Only send weekly data with all days accounted for
    }

    // Monthly data output
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonthlyData = leadCounts.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1], // Use month number to get month name
      count: item.count,
    }));

    return res.send(
      successRes(200, "ok", {
        data: formattedMonthlyData,
      })
    );
  } catch (error) {
    console.error("Error getting lead counts by team leader:", error);
    next(error);
  }
}

export async function getLeadCountsByPreSaleExecutve(req, res, next) {
  try {
    const { interval = "yearly", year, month, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

    // Validate and set selected year
    let selectedYear = year ? parseInt(year, 10) : currentYear;
    if (isNaN(selectedYear)) {
      return res.status(400).json({ message: "Invalid year parameter" });
    }

    // Validate and set selected month
    let selectedMonth = month ? parseInt(month, 10) : currentMonth;
    if (isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({ message: "Invalid month parameter" });
    }

    let matchStage = {};

    if (interval === "monthly") {
      const startOfMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonthDate = new Date(selectedYear, selectedMonth, 1);
      matchStage.startDate = {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      };
    } else if (interval === "weekly") {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6); // 6 days for a full week
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "quarterly") {
      const quarter = Math.ceil(selectedMonth / 3);
      const startOfQuarter = new Date(selectedYear, (quarter - 1) * 3, 1);
      const endOfQuarter = new Date(selectedYear, quarter * 3, 1);
      matchStage.startDate = {
        $gte: startOfQuarter,
        $lt: endOfQuarter,
      };
    } else if (interval === "semi-annually") {
      const isFirstHalf = selectedMonth <= 6;
      const startOfHalf = new Date(selectedYear, isFirstHalf ? 0 : 6, 1);
      const endOfHalf = new Date(selectedYear, isFirstHalf ? 6 : 12, 1);
      matchStage.startDate = {
        $gte: startOfHalf,
        $lt: endOfHalf,
      };
    } else if (interval === "yearly" || interval === "annually") {
      matchStage.startDate = {
        $gte: startOfYear(new Date(selectedYear, 0, 1)),
        $lt: endOfYear(new Date(selectedYear, 11, 31)),
      };
    } else if (interval === "custom" && startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    } else {
      return res
        .status(400)
        .json({ message: "Invalid interval or date range parameter" });
    }

    // Group stage and further aggregation logic for each interval
    let groupStage = {};
    if (interval === "weekly") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
          week: { $week: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "quarterly") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
          quarter: {
            $ceil: { $divide: [{ $month: "$startDate" }, 3] },
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "semi-annually") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
          half: {
            $cond: [{ $lte: [{ $month: "$startDate" }, 6] }, "H1", "H2"],
          },
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "yearly" || interval === "annually") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
          year: { $year: "$startDate" },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "custom") {
      groupStage = {
        _id: {
          preSalesExecutive: "$preSalesExecutive",
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $lookup: {
          from: "employees",
          localField: "_id.preSalesExecutive",
          foreignField: "_id",
          as: "preSalesExecutiveDetails",
        },
      },
      { $unwind: "$preSalesExecutiveDetails" },
      {
        $project: {
          preSalesExecutive: {
            $concat: [
              "$preSalesExecutiveDetails.firstName",
              " ",
              "$preSalesExecutiveDetails.lastName",
            ],
          },
          count: 1,
          interval,
          year: "$_id.year",
          ...(interval === "monthly" && {
            month: {
              $let: {
                vars: {
                  months: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                in: { $arrayElemAt: ["$$months", "$_id.month"] },
              },
            },
          }),
          ...(interval === "quarterly" && { quarter: "$_id.quarter" }),
          ...(interval === "semi-annually" && { half: "$_id.half" }),
        },
      },
      { $sort: { count: -1 } },
    ]);

    const responseData = leadCounts.map((item) => ({
      preSalesExecutive: item.preSalesExecutive,
      count: item.count,
      interval: item.interval,
      year: item.year,
      month: item.month,
      quarter: item.quarter,
      half: item.half,
    }));

    return res.send(successRes(200, "ok", { data: responseData }));
  } catch (error) {
    console.error("Error getting unique team leader lead counts:", error);
    next(error);
  }
}

export async function getAllLeadCountsFunnelForPreSaleTL(req, res, next) {
  try {
    const { interval = "yearly", year, month, startDate, endDate } = req.query;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Set and validate year and month
    let selectedYear = year ? parseInt(year, 10) : currentYear;
    let selectedMonth = month ? parseInt(month, 10) : currentMonth;

    if (
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      return res
        .status(400)
        .json({ message: "Invalid year or month parameter" });
    }

    // Define match stage
    let matchStage = {};

    if (interval === "monthly") {
      const startOfMonthDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endOfMonthDate = new Date(selectedYear, selectedMonth, 1);
      matchStage.startDate = {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      };
    } else if (interval === "weekly") {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "quarterly") {
      const quarter = Math.floor((selectedMonth - 1) / 3);
      const startOfQuarterDate = new Date(selectedYear, quarter * 3, 1);
      const endOfQuarterDate = new Date(selectedYear, (quarter + 1) * 3, 1);
      matchStage.startDate = {
        $gte: startOfQuarterDate,
        $lt: endOfQuarterDate,
      };
    } else if (interval === "semi-annually") {
      const half = Math.floor((selectedMonth - 1) / 6);
      const startOfHalfDate = new Date(selectedYear, half * 6, 1);
      const endOfHalfDate = new Date(selectedYear, (half + 1) * 6, 1);
      matchStage.startDate = {
        $gte: startOfHalfDate,
        $lt: endOfHalfDate,
      };
    } else if (interval === "yearly" || interval === "annually") {
      matchStage.startDate = {
        $gte: new Date(selectedYear, 0, 1),
        $lt: new Date(selectedYear + 1, 0, 1),
      };
    } else if (interval === "custom" && startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    } else {
      return res
        .status(400)
        .json({ message: "Invalid interval or date range parameter" });
    }

    // Define all possible statuses for the funnel
    const allStatuses = [
      "Booked",
      "Site Visit",
      "Leads Contacted",
      "Leads Received",
    ];

    // Group stage by lead status and interval
    let groupStage = {
      _id: { status: "$status" },
      count: { $sum: 1 },
    };

    if (interval === "weekly") {
      groupStage._id.week = { $week: "$startDate" };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "monthly") {
      groupStage._id.month = { $month: "$startDate" };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "quarterly") {
      groupStage._id.quarter = {
        $ceil: { $divide: [{ $month: "$startDate" }, 3] },
      };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "semi-annually") {
      groupStage._id.half = {
        $ceil: { $divide: [{ $month: "$startDate" }, 6] },
      };
      groupStage._id.year = { $year: "$startDate" };
    } else if (interval === "yearly" || interval === "annually") {
      groupStage._id.year = { $year: "$startDate" };
    }

    const leadCounts = await leadModel.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      {
        $project: {
          status: "$_id.status",
          count: 1,
          interval,
          year: "$_id.year",
          month: {
            $let: {
              vars: {
                months: [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          week: "$_id.week",
          quarter: "$_id.quarter",
          half: "$_id.half",
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Map lead counts to allStatuses to ensure each status is represented
    const responseData = allStatuses.map((status) => {
      const found = leadCounts.find(
        (item) => item.status === status || item.approvalStatus === status
      );
      return {
        status,
        count: found ? found.count : 0,
        interval,
        year: found ? found.year : selectedYear,
        month: found
          ? found.month
          : interval === "monthly"
          ? currentMonth
          : undefined,
        week: found ? found.week : undefined,
        quarter: found ? found.quarter : undefined,
        half: found ? found.half : undefined,
      };
    });

    return res.send(successRes(200, "ok", { data: responseData }));
  } catch (error) {
    console.error("Error getting all lead counts by status:", error);
    next(error);
  }
}
