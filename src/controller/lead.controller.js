import { validateRequiredLeadsFields } from "../middleware/lead.middleware.js";
import employeeModel from "../model/employee.model.js";
import leadModel from "../model/lead.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import siteVisitModel from "../model/siteVisit.model.js";
import TeamLeaderAssignTurn from "../model/teamLeaderAssignTurn.model.js";
import { leadPopulateOptions } from "../utils/constant.js";
import {
  sendNotificationWithImage,
  sendNotificationWithInfo,
} from "./oneSignal.controller.js";
import { startOfWeek, addDays, format, startOfYear, endOfYear } from "date-fns";
import { fileURLToPath } from "url";

import fs from "fs";
import csv from "csv-parser";
import path from "path";
import moment from "moment-timezone";
import PDFDocument from "pdfkit";
import taskModel from "../model/task.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Date.prototype.addDays = function (days) {
  const date = new Date(this); // Copy the current date
  date.setDate(this.getDate() + days); // Add the days
  return date;
};

export const getAllLeads = async (req, res, next) => {
  try {
    const today = new Date();
    // const endDate = new Date("2024-10-31T23:59:59.999Z");

    const respLeads = await leadModel
      .find({
        // startDate: { $gte: today },
      })
      .sort({ startDate: -1 })
      .populate(leadPopulateOptions);

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

// export const getLeadsTeamLeader = async (req, res, next) => {
//   const teamLeaderId = req.params.id;
//   try {
//     if (!teamLeaderId) return res.send(errorRes(401, "id required"));

//     let query = req.query.query || "";
//     let status = req.query.status?.toLowerCase();
//     let member = req.query.member;
//     let cycle = req.query.cycle;
//     let callData = req.query.callData;
//     let validity = req.query.validity;
//     let sort = req.query.sort;

//     const targetDate = validity
//       ? moment.tz(validity, "Asia/Kolkata")
//       : moment.tz("Asia/Kolkata");

//     // Get start and end of the target date
//     const startOfDay = targetDate.startOf("day").toDate(); // 00:00:00
//     const endOfDay = targetDate.endOf("day").toDate(); // 23:59:59

//     let ids = [];

//     if (member) {
//       const test = await taskModel.find({ assignTo: member }).select("_id");
//       test.map((ele) => {
//         ids.push(ele._id.toString());
//       });
//     }

//     const isNumberQuery = !isNaN(query);
//     const filterDate = new Date("2024-12-10");
//     let page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     let skip = (page - 1) * limit;

//     let statusToFind = null;

//     // Define statusToFind based on the status query parameter
//     // (The existing logic for statusToFind remains unchanged)

//     // let statusToFind = null;
//         let walkinType = { leadType: { $eq: "walk-in" } };

//         // if (status?.includes("visit2") && status != "") {
//         //   walkinType = {
//         //     $and: [
//         //       {
//         //         leadType: { $ne: "cp" },
//         //       },
//         //       {
//         //         leadType: { $ne: null },
//         //       },
//         //     ],
//         //   };
//         // }
//         if (status === "booking-done" || status === "booking") {
//           statusToFind = {
//             stage: "booking",
//             // bookingStatus: { $ne: "pending" },
//             $and: [
//               {
//                 bookingStatus: { $ne: null },
//               },
//               {
//                 bookingStatus: { $ne: "pending" },
//               },
//             ],
//           };
//         } else if (status === "revisit-done") {
//           statusToFind = {
//             stage: "booking",
//             // bookingStatus: { $ne: "booked" },
//             // revisitStatus: { $ne: "pending" },
//             $and: [
//               {
//                 revisitStatus: { $ne: null },
//               },
//               {
//                 revisitStatus: { $ne: "pending" },
//               },
//             ],

//             // ...walkinType,
//             leadType: { $ne: "walk-in" },
//           };
//         } else if (status === "visit-done" || status === "visit") {
//           statusToFind = {
//             stage: { $ne: "approval" },
//             stage: { $ne: "booking" },
//             $and: [
//               {
//                 visitStatus: { $ne: null },
//               },
//               {
//                 visitStatus: { $ne: "pending" },
//               },
//             ],
//             // ...walkinType,
//             leadType: { $ne: "walk-in" },
//           };
//         } else if (status === "revisit-pending") {
//           statusToFind = {
//             stage: { $eq: "revisit" },
//             stage: { $ne: "booking" },
//             // revisitStatus: { $eq: "pending" },
//             $and: [
//               {
//                 revisitStatus: { $ne: null },
//               },
//               {
//                 revisitStatus: { $eq: "pending" },
//               },
//             ],

//             // ...walkinType,
//             leadType: { $ne: "walk-in" },
//           };
//         } else if (status === "visit-pending") {
//           statusToFind = {
//             stage: { $eq: "visit" },
//             // visitStatus: { $eq: "pending" },
//             $and: [
//               {
//                 visitStatus: { $ne: null },
//               },
//               {
//                 visitStatus: { $eq: "pending" },
//               },
//             ],

//             // ...walkinType,
//             leadType: { $ne: "walk-in" },
//           };
//         } else if (status === "tagging-over") {
//           statusToFind = {
//             stage: { $eq: "tagging-over" },
//           };
//         } else if (status === "pending") {
//           statusToFind = {
//             teamLeader: { $eq: teamLeaderId },
//             startDate: { $gte: filterDate },
//             bookingStatus: { $ne: "booked" },

//             $or: [
//               {
//                 bookingStatus: { $ne: "booked" },
//                 visitStatus: "pending",
//               },
//               {
//                 bookingStatus: { $ne: "booked" },
//                 revisitStatus: "pending",
//               },
//             ],
//             leadType: { $ne: "walk-in" },
//           };
//         } else if (status === "visit2") {
//           statusToFind = {
//             visitStatus: { $ne: "pending" },
//             $and: [
//               {
//                 stage: { $ne: "tagging-over" },
//               },
//               {
//                 stage: { $ne: "approval" },
//               },
//             ],
//             // ...walkinType,
//           };
//         } else if (status === "followup") {
//           statusToFind = {
//             taskRef: { $ne: null },
//             // ...walkinType,
//           };
//         } else if (status === "not-followup") {
//           statusToFind = {
//             taskRef: { $eq: null },
//             // ...walkinType,
//           };
//         } else if (status === "visit2-revisit-done") {
//           statusToFind = {
//             stage: "booking",
//             // bookingStatus: { $ne: "booked" },
//             // revisitStatus: { $ne: "pending" },
//             $and: [
//               {
//                 revisitStatus: { $ne: null },
//               },
//               {
//                 revisitStatus: { $ne: "pending" },
//               },
//             ],

//             // ...walkinType,
//             leadType: { $eq: "walk-in" },
//           };
//         } else if (status === "visit2-visit-done" || status === "visit2") {
//           statusToFind = {
//             stage: { $ne: "approval" },
//             stage: { $ne: "booking" },
//             $and: [
//               {
//                 visitStatus: { $ne: null },
//               },
//               {
//                 visitStatus: { $ne: "pending" },
//               },
//             ],
//             // ...walkinType,
//             leadType: { $eq: "walk-in" },
//           };
//         } else if (status == "line-up") {
//           console.log("line-up");
//           statusToFind = {
//             siteVisitInterested: true,
//           };
//         }
//         else if(callData=="Call Not Received" || callData=="call not received"){
//           console.log("call not received");
//           statusToFind = {

//             stage: { $ne: "approval" },
//             stage: { $ne: "booking" },
//             $and: [
//               {
//                 visitStatus: { $ne: null },
//               },
//               {
//                 visitStatus: { $ne: "pending" },
//               },
//             ],
//             // ...walkinType,
//             leadType: { $ne: "walk-in" },
//           };
//         }

//     // Base Filter for Search and Leads Query
//     let baseFilter = {
//       teamLeader: { $eq: teamLeaderId },
//       startDate: { $gte: filterDate },
//       ...(statusToFind != null ? statusToFind : null),
//       ...(member != null ? { taskRef: { $in: ids } } : null),
//       ...(cycle != null ? { "cycle.currentOrder": cycle } : null),
//       ...(validity != null
//         ? {
//             "cycle.validTill": {
//               $gte: startOfDay,
//               $lte: endOfDay,
//             },
//           }
//         : null),
//     };

//     if (callData === "Call Done" || callData === "call done") {
//       baseFilter.callHistory = {
//         $elemMatch: {
//           remark: "Call Done",
//         },
//       };
//     }

//     if (query) {
//       const searchConditions = [
//         { firstName: { $regex: query, $options: "i" } },
//         { lastName: { $regex: query, $options: "i" } },
//         isNumberQuery
//           ? {
//               $expr: {
//                 $regexMatch: {
//                   input: { $toString: "$phoneNumber" },
//                   regex: query,
//                 },
//               },
//             }
//           : null,
//         isNumberQuery
//           ? {
//               $expr: {
//                 $regexMatch: {
//                   input: { $toString: "$altPhoneNumber" },
//                   regex: query,
//                 },
//               },
//             }
//           : null,
//         { email: { $regex: query, $options: "i" } },
//         { address: { $regex: query, $options: "i" } },
//         { status: { $regex: query, $options: "i" } },
//         { interestedStatus: { $regex: query, $options: "i" } },
//       ].filter(Boolean);

//       baseFilter.$or = searchConditions;
//     }

//     // Fetch Leads
//     const respLeads = await leadModel
//       .find(baseFilter)
//       .skip(skip)
//       .limit(limit)
//       .sort({ "cycle.startDate": sort === "asc" ? 1 : -1 })
//       .populate(leadPopulateOptions);

//     // Count logic remains unchanged
//     const counts = await leadModel.aggregate([
//       { $match: { teamLeader: teamLeaderId, startDate: { $gte: filterDate } } },
//       {
//         $facet: {
//           totalItems: [{ $count: " count" }],
//           totalItemsCount: [
//             {
//               $match: baseFilter,
//             },
//             { $count: "count" },
//           ],
//           pendingCount: [
//             {
//               $match: {
//                 $or: [
//                   { visitStatus: "pending", bookingStatus: { $ne: "booked" } },
//                   {
//                     revisitStatus: "pending",
//                     bookingStatus: { $ne: "booked" },
//                   },
//                 ],
//               },
//             },
//             { $count: "count" },
//           ],
//           contactedCount: [
//             { $match: { contactedStatus: { $ne: "pending" } } },
//             { $count: "count" },
//           ],
//           followUpCount: [
//             { $match: { followupStatus: { $ne: "pending" } } },
//             { $count: "count" },
//           ],
//           assignedCount: [{ $match: { taskRef: { $ne: null } } }, { $count: "count" }],
//           visitCount: [
//             {
//               $match: {
//                 stage: { $ne: "approval" },
//                 stage: { $ne: "booking" },
//                 $and: [
//                   {
//                     visitStatus: { $ne: null },
//                   },
//                   {
//                     visitStatus: { $ne: "pending" },
//                   },
//                 ],
//               },
//             },
//             { $count: "count" },
//           ],
//           revisitCount: [
//             {
//               $match: {
//                 stage: "booking",
//                 $and: [
//                   {
//                     revisitStatus: { $ne: null },
//                   },
//                   {
//                     revisitStatus: { $ne: "pending" },
//                   },
//                 ],
//               },
//             },
//             { $count: "count" },
//           ],
//           visit2Count: [
//             {
//               $match: {
//                 visitStatus: { $ne: "pending" },
//                 leadType: { $eq: "walk-in" },
//               },
//             },
//             { $count: "count" },
//           ],
//           bookingCount: [
//             {
//               $match: {
//                 bookingStatus: { $ne: "pending" },
//                 stage: { $eq: "booking" },
//               },
//             },
//             { $count: "count" },
//           ],
//           lineUpCount: [
//             {
//               $match: {
//                 stage: { $ne: "tagging-over" },
//                 leadType: { $ne: "walk-in" },
//                 siteVisitInterested: true,
//               },
//             },
//             { $count: "count" },
//           ],
//         },
//       },
//       {
//         $addFields: {
//           totalItems: { $arrayElemAt: ["$totalItems.count", 0] },
//           totalItemsCount: { $arrayElemAt: ["$totalItemsCount.count", 0] },
//           pendingCount: { $arrayElemAt: ["$pendingCount.count", 0] },
//           contactedCount: { $arrayElemAt: ["$contactedCount.count", 0] },
//           followUpCount: { $arrayElemAt: ["$followUpCount.count", 0] },
//           assignedCount: { $arrayElemAt: ["$assignedCount.count", 0] },
//           visitCount: { $arrayElemAt: ["$visitCount.count", 0] },
//           revisitCount: { $arrayElemAt: ["$revisitCount.count", 0] },
//           visit2Count: { $arrayElemAt: ["$visit2Count.count", 0] },
//           bookingCount: { $arrayElemAt: ["$bookingCount.count", 0] },
//           lineUpCount: { $arrayElemAt: ["$lineUpCount.count", 0] },
//         },
//       },
//       {
//         $project: {
//           totalItems: 1,
//           pendingCount: 1,
//           contactedCount: 1,
//           followUpCount: 1,
//           assignedCount: 1,
//           visitCount: 1,
//           revisitCount: 1,
//           visit2Count: 1,
//           bookingCount: 1,
//           totalItemsCount: 1,
//           lineUpCount: 1,
//         },
//       },
//     ]);

//     const {
//       totalItems = 0,
//       pendingCount = 0,
//       contactedCount = 0,
//       followUpCount = 0,
//       assignedCount = 0,
//       visitCount = 0,
//       revisitCount = 0,
//       visit2Count = 0,
//       bookingCount = 0,
//       totalItemsCount = 0,
//       lineUpCount = 0,
//     } = counts[0] || {};

//     const totalPages = Math.ceil(totalItems / limit);

//     return res.send(
//       successRes(200, "Leads for team Leader", {
//         page,
//         limit,
//  totalPages,
//         totalItems,
//         pendingCount,
//         contactedCount,
//         followUpCount,
//         assignedCount,
//         visitCount,
//         visit2Count,
//         revisitCount,
//         bookingCount,
//         totalItemsCount,
//         lineUpCount,
//         data: respLeads,
//       })
//     );
//   } catch (error) {
//     next(error);
//   }
// };

export const getLeadsTeamLeader = async (req, res, next) => {
  const teamLeaderId = req.params.id;
  try {
    if (!teamLeaderId) return res.send(errorRes(401, "id required"));

    let query = req.query.query || "";
    let status = req.query.status?.toLowerCase();
    let member = req.query.member;
    let cycle = req.query.cycle;
    let callData = req.query.callData;
    // let callDone =req.query.callDone;

    let validity = req.query.validity;
    let sort = req.query.sort;

    const targetDate = validity
      ? moment.tz(validity, "Asia/Kolkata")
      : moment.tz("Asia/Kolkata");

    // Get start and end of the target date
    const startOfDay = targetDate.startOf("day").toDate(); // 00:00:00
    const endOfDay = targetDate.endOf("day").toDate(); // 23:59:59

    let ids = [];

    // console.log(query,status,member,ids);

    if (member) {
      console.log("entered member");
      const test = await taskModel.find({ assignTo: member }).select("_id");
      test.map((ele) => {
        ids.push(ele._id.toString());
      });

      // console.log(ids);
    }
    const isNumberQuery = !isNaN(query);
    const filterDate = new Date("2024-12-10");
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    let statusToFind = null;
    let walkinType = { leadType: { $eq: "walk-in" } };

    // if (status?.includes("visit2") && status != "") {
    //   walkinType = {
    //     $and: [
    //       {
    //         leadType: { $ne: "cp" },
    //       },
    //       {
    //         leadType: { $ne: null },
    //       },
    //     ],
    //   };
    // }
    if (status === "booking-done" || status === "booking") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "pending" },
        $and: [
          {
            bookingStatus: { $ne: null },
          },
          {
            bookingStatus: { $ne: "pending" },
          },
        ],
      };
    } else if (status === "revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-done" || status === "visit") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "revisit-pending") {
      statusToFind = {
        stage: { $eq: "revisit" },
        stage: { $ne: "booking" },
        // revisitStatus: { $eq: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-pending") {
      statusToFind = {
        stage: { $eq: "visit" },
        // visitStatus: { $eq: "pending" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "tagging-over") {
      statusToFind = {
        stage: { $eq: "tagging-over" },
      };
    } else if (status === "pending") {
      statusToFind = {
        teamLeader: { $eq: teamLeaderId },
        startDate: { $gte: filterDate },
        bookingStatus: { $ne: "booked" },

        $or: [
          {
            bookingStatus: { $ne: "booked" },
            visitStatus: "pending",
          },
          {
            bookingStatus: { $ne: "booked" },
            revisitStatus: "pending",
          },
        ],
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit2") {
      statusToFind = {
        visitStatus: { $ne: "pending" },
        $and: [
          {
            stage: { $ne: "tagging-over" },
          },
          {
            stage: { $ne: "approval" },
          },
        ],
        // ...walkinType,
      };
    } else if (status === "followup") {
      statusToFind = {
        taskRef: { $ne: null },
        // ...walkinType,
      };
    } else if (status === "not-followup") {
      statusToFind = {
        taskRef: { $eq: null },
        // ...walkinType,
      };
    } else if (status === "visit2-revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (status === "visit2-visit-done" || status === "visit2") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (status == "line-up") {
      console.log("line-up");
      statusToFind = {
        siteVisitInterested: true,
      };
    } else if (callData == "Call Not Received" || callData == "call not received") {
      console.log("call not received");
      // statusToFind = {

      //   stage: { $ne: "approval" },
      //   stage: { $ne: "booking" },
      //   $and: [
      //     {
      //       visitStatus: { $ne: null },
      //     },
      //     {
      //       visitStatus: { $ne: "pending" },
      //     },
      //   ],
      // ...walkinType,
      // leadType: { $ne: "walk-in" },
      // };
    } else if (callData == "Call Done" || callData == "Call done") {
      console.log("call done");
    }

    // Base Filter for Search and Leads Query
    let baseFilter = {
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },
      ...(statusToFind != null ? statusToFind : null),
      ...(member != null ? { taskRef: { $in: ids } } : null),
      ...(cycle != null ? { "cycle.currentOrder": cycle } : null),
      ...(callData != null
        ? {
            $expr: {
              $eq: [
                { $arrayElemAt: ["$callHistory.remark", -1] }, // Get the last remark in callHistory
                callData, // Compare it with the passed value
              ],
            },
          }
        : {}),
    };
    console.log(baseFilter);
    // Add query search conditions (if applicable)
    if (query) {
      const searchConditions = [
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
      ].filter(Boolean);

      baseFilter.$or = searchConditions;
    }
    console.log(JSON.stringify(baseFilter, null, 2));
    // Fetch Leads
    const respLeads = await leadModel
      .find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ "cycle.startDate": sort === "asc" ? 1 : -1 })
      .populate(leadPopulateOptions);

    // if (!respLeads.length) return res.send(errorRes(404, "No leads found"));

    const counts = await leadModel.aggregate([
      { $match: { teamLeader: teamLeaderId, startDate: { $gte: filterDate } } },
      {
        $facet: {
          totalItems: [{ $count: "count" }],
          totalItemsCount: [
            {
              $match: baseFilter,
            },
            { $count: "count" },
          ],
          pendingCount: [
            {
              $match: {
                $or: [
                  { visitStatus: "pending", bookingStatus: { $ne: "booked" } },
                  {
                    revisitStatus: "pending",
                    bookingStatus: { $ne: "booked" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          contactedCount: [
            { $match: { contactedStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          followUpCount: [
            { $match: { followupStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          assignedCount: [{ $match: { taskRef: { $ne: null } } }, { $count: "count" }],
          visitCount: [
            {
              $match: {
                stage: { $ne: "approval" },
                stage: { $ne: "booking" },
                $and: [
                  {
                    visitStatus: { $ne: null },
                  },
                  {
                    visitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          revisitCount: [
            {
              $match: {
                stage: "booking",
                $and: [
                  {
                    revisitStatus: { $ne: null },
                  },
                  {
                    revisitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          visit2Count: [
            {
              $match: {
                visitStatus: { $ne: "pending" },
                leadType: { $eq: "walk-in" },
              },
            },
            { $count: "count" },
          ],
          bookingCount: [
            {
              $match: {
                bookingStatus: { $ne: "pending" },
                stage: { $eq: "booking" },
              },
            },
            { $count: "count" },
          ],
          lineUpCount: [
            {
              $match: {
                stage: { $ne: "tagging-over" },
                leadType: { $ne: "walk-in" },
                siteVisitInterested: true,
              },
            },
            { $count: "count" },
          ],

          // Add other count stages as required
        },
      },
      {
        $addFields: {
          totalItems: { $arrayElemAt: ["$totalItems.count", 0] },
          totalItemsCount: { $arrayElemAt: ["$totalItemsCount.count", 0] },
          pendingCount: { $arrayElemAt: ["$pendingCount.count", 0] },
          contactedCount: { $arrayElemAt: ["$contactedCount.count", 0] },
          followUpCount: { $arrayElemAt: ["$followUpCount.count", 0] },
          assignedCount: { $arrayElemAt: ["$assignedCount.count", 0] },
          visitCount: { $arrayElemAt: ["$visitCount.count", 0] },
          revisitCount: { $arrayElemAt: ["$revisitCount.count", 0] },
          visit2Count: { $arrayElemAt: ["$visit2Count.count", 0] },
          bookingCount: { $arrayElemAt: ["$bookingCount.count", 0] },
          lineUpCount: { $arrayElemAt: ["$lineUpCount.count", 0] },
          // Add other fields similarly as required
        },
      },
      {
        $project: {
          totalItems: 1,
          pendingCount: 1,
          contactedCount: 1,
          followUpCount: 1,
          assignedCount: 1,
          visitCount: 1,
          revisitCount: 1,
          visit2Count: 1,
          bookingCount: 1,
          totalItemsCount: 1,
          lineUpCount: 1,
          // Include only the fields you need
        },
      },
    ]);

    const {
      totalItems = 0,
      pendingCount = 0,
      contactedCount = 0,
      followUpCount = 0,
      assignedCount = 0,
      visitCount = 0,
      revisitCount = 0,
      visit2Count = 0,
      bookingCount = 0,
      totalItemsCount = 0,
      lineUpCount = 0,
      // Add other counts as required
    } = counts[0] || {};

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
        visit2Count,
        revisitCount,
        bookingCount,
        totalItemsCount,
        lineUpCount,
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAssignedToSalesManger = async (req, res, next) => {
  const salesManagerId = req.params.id;

  const respTeamLeader = await employeeModel.findById(salesManagerId);
  const teamLeaderId = respTeamLeader.reportingTo;

  // console.log(salesManagerId);
  try {
    if (!salesManagerId) return res.send(errorRes(401, "id required"));

    let query = req.query.query || "";
    let status = req.query.status?.toLowerCase();
    let ids = [];
    let callData = req.query.callData;
    // let callDone =req.query.callDone;
    let validity = req.query.validity;

    const targetDate = validity
      ? moment.tz(validity, "Asia/Kolkata")
      : moment.tz("Asia/Kolkata");

    // Get start and end of the target date
    const startOfDay = targetDate.startOf("day").toDate(); // 00:00:00
    const endOfDay = targetDate.endOf("day").toDate(); // 23:59:59

    if (salesManagerId) {
      console.log("entered member");
      const test = await taskModel.find({ assignTo: salesManagerId }).select("_id");
      test.map((ele) => {
        ids.push(ele._id.toString());
      });

      // console.log(ids);
    }
    const isNumberQuery = !isNaN(query);
    const filterDate = new Date("2024-12-10");
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let skip = (page - 1) * limit;

    let statusToFind = null;
    let walkinType = { leadType: { $eq: "walk-in" } };

    // if (status?.includes("visit2") && status != "") {
    //   walkinType = {
    //     $and: [
    //       {
    //         leadType: { $ne: "cp" },
    //       },
    //       {
    //         leadType: { $ne: null },
    //       },
    //     ],
    //   };
    // }
    if (status === "booking-done" || status === "booking") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "pending" },
        $and: [
          {
            bookingStatus: { $ne: null },
          },
          {
            bookingStatus: { $ne: "pending" },
          },
        ],
      };
    } else if (status === "revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-done" || status === "visit") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "revisit-pending") {
      statusToFind = {
        stage: { $eq: "revisit" },
        stage: { $ne: "booking" },
        // revisitStatus: { $eq: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-pending") {
      statusToFind = {
        stage: { $eq: "visit" },
        // visitStatus: { $eq: "pending" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "tagging-over") {
      statusToFind = {
        stage: { $eq: "tagging-over" },
      };
    } else if (status === "pending") {
      statusToFind = {
        teamLeader: { $eq: teamLeaderId },
        startDate: { $gte: filterDate },
        bookingStatus: { $ne: "booked" },

        $or: [
          {
            bookingStatus: { $ne: "booked" },
            visitStatus: "pending",
          },
          {
            bookingStatus: { $ne: "booked" },
            revisitStatus: "pending",
          },
        ],
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit2") {
      statusToFind = {
        visitStatus: { $ne: "pending" },
        $and: [
          {
            stage: { $ne: "tagging-over" },
          },
          {
            stage: { $ne: "approval" },
          },
        ],
        // ...walkinType,
      };
    } else if (status === "followup") {
      statusToFind = {
        taskRef: { $ne: null },
        // ...walkinType,
      };
    } else if (status === "not-followup") {
      statusToFind = {
        taskRef: { $eq: null },
        // ...walkinType,
      };
    } else if (status === "visit2-revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (status === "visit2-visit-done" || status === "visit2") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (callData == "Call Not Received" || callData == "call not received") {
      console.log("call not received");
    } else if (callData == "Call Done" || callData == "call Done") {
      console.log("call done");
    }
    // console.log("yes2");
    // Base Filter for Search and Leads Query
    let baseFilter = {
      startDate: { $gte: filterDate },
      ...(statusToFind != null ? statusToFind : null),
      ...(salesManagerId != null ? { taskRef: { $in: ids } } : null),
      ...(callData != null
        ? {
            $expr: {
              $eq: [
                { $arrayElemAt: ["$callHistory.remark", -1] }, // Get the last remark in callHistory
                callData, // Compare it with the passed value
              ],
            },
          }
        : {}),
    };
    // console.log(baseFilter);
    // Add query search conditions (if applicable)
    if (query) {
      const searchConditions = [
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
      ].filter(Boolean);

      baseFilter.$or = searchConditions;
    }

    // console.log(JSON.stringify(baseFilter, null, 2));
    // Fetch Leads
    const respLeads = await leadModel
      .find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ "cycle.startDate": -1 })
      .populate(leadPopulateOptions);

    // if (!respLeads.length) return res.send(errorRes(404, "No leads found"));

    const counts = await leadModel.aggregate([
      { $match: { teamLeader: teamLeaderId, startDate: { $gte: filterDate } } },
      {
        $facet: {
          totalItems: [{ $count: "count" }],
          pendingCount: [
            {
              $match: {
                $or: [
                  { visitStatus: "pending", bookingStatus: { $ne: "booked" } },
                  {
                    revisitStatus: "pending",
                    bookingStatus: { $ne: "booked" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          contactedCount: [
            { $match: { contactedStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          followUpCount: [
            { $match: { followupStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          assignedCount: [{ $match: { taskRef: { $ne: null } } }, { $count: "count" }],
          visitCount: [
            {
              $match: {
                stage: { $ne: "approval" },
                stage: { $ne: "booking" },
                $and: [
                  {
                    visitStatus: { $ne: null },
                  },
                  {
                    visitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          revisitCount: [
            {
              $match: {
                stage: "booking",
                $and: [
                  {
                    revisitStatus: { $ne: null },
                  },
                  {
                    revisitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          visit2Count: [
            {
              $match: {
                visitStatus: { $ne: "pending" },
                leadType: { $eq: "walk-in" },
              },
            },
            { $count: "count" },
          ],
          bookingCount: [
            {
              $match: {
                bookingStatus: { $ne: "pending" },
                stage: { $eq: "booking" },
              },
            },
            { $count: "count" },
          ],

          // Add other count stages as required
        },
      },
      {
        $addFields: {
          totalItems: { $arrayElemAt: ["$totalItems.count", 0] },
          pendingCount: { $arrayElemAt: ["$pendingCount.count", 0] },
          contactedCount: { $arrayElemAt: ["$contactedCount.count", 0] },
          followUpCount: { $arrayElemAt: ["$followUpCount.count", 0] },
          assignedCount: { $arrayElemAt: ["$assignedCount.count", 0] },
          visitCount: { $arrayElemAt: ["$visitCount.count", 0] },
          revisitCount: { $arrayElemAt: ["$revisitCount.count", 0] },
          visit2Count: { $arrayElemAt: ["$visit2Count.count", 0] },
          bookingCount: { $arrayElemAt: ["$bookingCount.count", 0] },
          // Add other fields similarly as required
        },
      },
      {
        $project: {
          totalItems: 1,
          pendingCount: 1,
          contactedCount: 1,
          followUpCount: 1,
          assignedCount: 1,
          visitCount: 1,
          revisitCount: 1,
          visit2Count: 1,
          bookingCount: 1,
          // Include only the fields you need
        },
      },
    ]);

    // console.log(counts);
    const {
      totalItems = 0,
      pendingCount = 0,
      contactedCount = 0,
      followUpCount = 0,
      assignedCount = 0,
      visitCount = 0,
      revisitCount = 0,
      visit2Count = 0,
      bookingCount = 0,

      // Add other counts as required
    } = counts[0] || {};

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
        visit2Count,
        revisitCount,
        bookingCount,
        length: respLeads.length,
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getLeadsTeamLeaderReportingTo = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "id required"));

    const respTeamLeader = await employeeModel.findById(id);
    const teamLeaderId = respTeamLeader.reportingTo;

    let query = req.query.query || "";
    let status = req.query.status?.toLowerCase();
    let callData = req.query.callData;
    let callDone = req.query.callDone;
    let validity = req.query.validity;

    const targetDate = validity
      ? moment.tz(validity, "Asia/Kolkata")
      : moment.tz("Asia/Kolkata");

    // Get start and end of the target date
    const startOfDay = targetDate.startOf("day").toDate(); // 00:00:00
    const endOfDay = targetDate.endOf("day").toDate(); // 23:59:59

    const filterDate = new Date("2024-12-10");

    const isNumberQuery = !isNaN(query);

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    let statusToFind = null;
    let walkinType = { leadType: { $ne: "walk-in" } };

    if (status?.includes("visit2") && status != "") {
      walkinType = {
        $and: [
          {
            leadType: { $ne: "cp" },
          },
          {
            leadType: { $ne: null },
          },
        ],
      };
    }
    if (status === "booking-done" || status === "booking") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "pending" },
        $and: [
          {
            bookingStatus: { $ne: null },
          },
          {
            bookingStatus: { $ne: "pending" },
          },
        ],
      };
    } else if (status === "revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-done" || status === "visit") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "revisit-pending") {
      statusToFind = {
        stage: { $eq: "revisit" },
        stage: { $ne: "booking" },
        // revisitStatus: { $eq: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit-pending") {
      statusToFind = {
        stage: { $eq: "visit" },
        // visitStatus: { $eq: "pending" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $eq: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "tagging-over") {
      statusToFind = {
        stage: { $eq: "tagging-over" },
      };
    } else if (status === "pending") {
      statusToFind = {
        teamLeader: { $eq: teamLeaderId },
        startDate: { $gte: filterDate },
        stage: { $ne: "booking" },

        $or: [
          {
            stage: { $ne: "booking" },
            visitStatus: "pending",
          },
          {
            stage: { $ne: "booking" },
            revisitStatus: "pending",
          },
        ],
        leadType: { $ne: "walk-in" },
      };
    } else if (status === "visit2") {
      statusToFind = {
        visitStatus: { $ne: "pending" },
        $and: [
          {
            stage: { $ne: "tagging-over" },
          },
          {
            stage: { $ne: "approval" },
          },
        ],
        ...walkinType,
      };
    } else if (status === "followup") {
      statusToFind = {
        taskRef: { $ne: null },
        ...walkinType,
      };
    } else if (status === "not-followup") {
      statusToFind = {
        taskRef: { $eq: null },
        ...walkinType,
      };
    } else if (status === "visit2-revisit-done") {
      statusToFind = {
        stage: "booking",
        // bookingStatus: { $ne: "booked" },
        // revisitStatus: { $ne: "pending" },
        $and: [
          {
            revisitStatus: { $ne: null },
          },
          {
            revisitStatus: { $ne: "pending" },
          },
        ],

        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (status === "visit2-visit-done" || status === "visit2") {
      statusToFind = {
        stage: { $ne: "approval" },
        stage: { $ne: "booking" },
        $and: [
          {
            visitStatus: { $ne: null },
          },
          {
            visitStatus: { $ne: "pending" },
          },
        ],
        // ...walkinType,
        leadType: { $eq: "walk-in" },
      };
    } else if (status == "line-up") {
      // console.log("booi pendding");
      statusToFind = {
        siteVisitInterested: true,
      };
    } else if (callData == "Call Not Received" || callData == "call not received") {
      console.log("call not received");
    } else if (callData == "Call Done") {
      console.log("call done");
    }

    // Base Filter for Search and Leads Query
    let baseFilter = {
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },
      ...(statusToFind != null ? statusToFind : null),
      ...(callData != null
        ? {
            $expr: {
              $eq: [
                { $arrayElemAt: ["$callHistory.remark", -1] }, // Get the last remark in callHistory
                callData, // Compare it with the passed value
              ],
            },
          }
        : {}),
    };

    // Add query search conditions (if applicable)
    if (query) {
      const searchConditions = [
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
      ].filter(Boolean);

      baseFilter.$or = searchConditions;
    }

    // Fetch Leads
    const respLeads = await leadModel
      .find(baseFilter)
      .skip(skip)
      .limit(limit)
      .sort({ "cycle.startDate": -1 })
      .populate(leadPopulateOptions);

    // if (!respLeads.length) return res.send(errorRes(404, "No leads found"));

    // Calculate Counts
    const counts = await leadModel.aggregate([
      { $match: { teamLeader: teamLeaderId, startDate: { $gte: filterDate } } },
      {
        $facet: {
          totalItems: [{ $count: "count" }],
          pendingCount: [
            {
              $match: {
                $or: [
                  { visitStatus: "pending", bookingStatus: { $ne: "booked" } },
                  {
                    revisitStatus: "pending",
                    bookingStatus: { $ne: "booked" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          contactedCount: [
            { $match: { contactedStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          followUpCount: [
            { $match: { followupStatus: { $ne: "pending" } } },
            { $count: "count" },
          ],
          assignedCount: [{ $match: { taskRef: { $ne: null } } }, { $count: "count" }],
          visitCount: [
            {
              $match: {
                stage: { $ne: "approval" },
                stage: { $ne: "booking" },
                $and: [
                  {
                    visitStatus: { $ne: null },
                  },
                  {
                    visitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          revisitCount: [
            {
              $match: {
                stage: "booking",
                $and: [
                  {
                    revisitStatus: { $ne: null },
                  },
                  {
                    revisitStatus: { $ne: "pending" },
                  },
                ],
              },
            },
            { $count: "count" },
          ],
          visit2Count: [
            {
              $match: {
                visitStatus: { $ne: "pending" },
                leadType: { $eq: "walk-in" },
              },
            },
            { $count: "count" },
          ],
          bookingCount: [
            {
              $match: {
                bookingStatus: { $ne: "pending" },
                stage: { $eq: "booking" },
              },
            },
            { $count: "count" },
          ],
          lineUpCount: [
            {
              $match: {
                stage: { $ne: "tagging-over" },
                leadType: { $ne: "walk-in" },
                siteVisitInterested: true,
              },
            },
            { $count: "count" },
          ],
          // Add other count stages as required
        },
      },
      {
        $addFields: {
          totalItems: { $arrayElemAt: ["$totalItems.count", 0] },
          pendingCount: { $arrayElemAt: ["$pendingCount.count", 0] },
          contactedCount: { $arrayElemAt: ["$contactedCount.count", 0] },
          followUpCount: { $arrayElemAt: ["$followUpCount.count", 0] },
          assignedCount: { $arrayElemAt: ["$assignedCount.count", 0] },
          visitCount: { $arrayElemAt: ["$visitCount.count", 0] },
          revisitCount: { $arrayElemAt: ["$revisitCount.count", 0] },
          visit2Count: { $arrayElemAt: ["$visit2Count.count", 0] },
          bookingCount: { $arrayElemAt: ["$bookingCount.count", 0] },
          lineUpCount: { $arrayElemAt: ["$lineUpCount.count", 0] },
          // Add other fields similarly as required
        },
      },
      {
        $project: {
          totalItems: 1,
          pendingCount: 1,
          contactedCount: 1,
          followUpCount: 1,
          assignedCount: 1,
          visitCount: 1,
          revisitCount: 1,
          visit2Count: 1,
          bookingCount: 1,
          lineUpCount: 1,
          // Include only the fields you need
        },
      },
    ]);

    const {
      totalItems = 0,
      pendingCount = 0,
      contactedCount = 0,
      followUpCount = 0,
      assignedCount = 0,
      visitCount = 0,
      revisitCount = 0,
      visit2Count = 0,
      bookingCount = 0,
      lineUpCount = 0,

      // Add other counts as required
    } = counts[0] || {};

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
        visit2Count,
        revisitCount,
        bookingCount,
        lineUpCount,
        length: respLeads.length,
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const leadUpdateStatus = async (req, res, next) => {
  const id = req.params.id;
  const { status, bookingRef, visitRef, revisitRef } = req.body;
  try {
    if (!id) return res.send(errorRes(401, "id required"));
    if (!status) return res.send(errorRes(401, "status required"));

    const foundLead = await leadModel.findById(id);
    if (!foundLead) {
      return res.send(errorRes(404, "no lead found with id"));
    }
    const foundTLPlayerId = await oneSignalModel.findOne({
      docId: foundLead?.channelPartner,
      // role: teamLeaderResp?.role,
    });

    if (status === "booked") {
      foundLead.bookingStatus = "booked";
      foundLead.bookingRef = bookingRef;
      await foundLead.save();
      if (foundLead.channelPartner) {
        if (foundTLPlayerId) {
          try {
            await sendNotificationWithInfo({
              playerIds: [foundTLPlayerId.playerId],
              title: "Booking Done",
              message: `Booking Done for ${foundLead.firstName ?? ""} ${
                foundLead.lastName ?? ""
              }.`,
            });
          } catch (error) {}
        }
      }
    }

    if (status === "visited") {
      foundLead.visitStatus = "visited";
      foundLead.stage = "revisit";
      foundLead.visitRef = visitRef;
      foundLead.cycle.stage = "revisit";
      foundLead.cycle.validTill = new Date().addDays(30);
      await foundLead.save();

      if (foundLead.channelPartner) {
        if (foundTLPlayerId) {
          await sendNotificationWithImage({
            playerIds: [foundTLPlayerId.playerId],
            title: "Site Visit done",
            message: `Site Visit Done for ${foundLead.firstName ?? ""} ${
              foundLead.lastName ?? ""
            }.`,
            imageUrl:
              "https://cdni.iconscout.com/illustration/premium/thumb/couple-visiting-construction-site-for-checking-work-progress-illustration-download-in-svg-png-gif-file-formats--crane-lifting-family-plot-area-real-estate-pack-buildings-illustrations-1757215.png",
          });
        }
      }
    }
    if (status === "revisited") {
      foundLead.revisitStatus = "revisited";
      foundLead.stage = "booking";
      foundLead.revisitRef = revisitRef;
      foundLead.cycle.validTill = new Date().addDays(180);

      await foundLead.save();
      if (foundLead.channelPartner) {
        if (foundTLPlayerId) {
          try {
            await sendNotificationWithInfo({
              playerIds: [foundTLPlayerId.playerId],
              title: "Revisit Done",
              message: `Revisit Done for ${foundLead.firstName ?? ""} ${
                foundLead.lastName ?? ""
              }.`,
            });
          } catch (error) {}
        }
      }
    }
    if (status === "called") {
      foundLead.contactedStatus = "contacted";
      // foundLead.revisitRef = revisitRef;
      await foundLead.save();
    }

    return res.send(
      successRes(200, "Status Updated", {
        data: foundLead,
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
    const filterDate = new Date("2024-12-10");

    const leadCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
        startDate: { $gte: filterDate },
      })) || 0;

    // const bookingCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },
    //     bookingStatus: { $ne: "pending" },
    //   })) || 0;

    // const visitCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },
    //     visitStatus: { $ne: "pending" },
    //   })) || 0;

    // const revisitCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },

    //     revisitStatus: { $ne: "pending" },
    //   })) || 0;

    /* --new graphs -- */
    const visitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      visitStatus: { $ne: "pending" },
      leadType: { $ne: "walk-in" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const revisitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      revisitStatus: { $ne: "pending" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });
    const visit2Count = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      visitStatus: { $ne: "pending" },
      leadType: { $eq: "walk-in" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const bookingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      bookingStatus: { $ne: "pending" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const pendingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      bookingStatus: { $ne: "booked" },
      $or: [
        {
          visitStatus: "pending",
        },
        {
          revisitStatus: "pending",
        },
      ],
    });

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
          visit2Count,
          pendingCount,
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

export const getLeadTeamLeaderReportingToGraph = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "id Required"));

    const userResp = await employeeModel.findById(id);

    const filterDate = new Date("2024-12-10");
    var teamLeaderId = userResp.reportingTo;

    const leadCount =
      (await leadModel.countDocuments({
        teamLeader: { $eq: teamLeaderId },
        startDate: { $gte: filterDate },
      })) || 0;

    // const bookingCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },
    //     bookingStatus: { $ne: "pending" },
    //   })) || 0;

    // const visitCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },
    //     visitStatus: { $ne: "pending" },
    //   })) || 0;

    // const revisitCount =
    //   (await leadModel.countDocuments({
    //     teamLeader: { $eq: teamLeaderId },

    //     revisitStatus: { $ne: "pending" },
    //   })) || 0;

    /* --new graphs -- */
    const visitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },

      visitStatus: { $ne: "pending" },
      leadType: { $ne: "walk-in" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const revisitCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },

      revisitStatus: { $ne: "pending" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });
    const visit2Count = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },

      visitStatus: { $ne: "pending" },
      leadType: { $eq: "walk-in" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const bookingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },

      bookingStatus: { $ne: "pending" },
      stage: { $eq: "booking" },
      $or: [
        {
          stage: { $ne: "tagging-over" },
        },
        {
          stage: { $ne: "approval" },
        },
      ],
    });

    const pendingCount = await leadModel.countDocuments({
      teamLeader: { $eq: teamLeaderId },
      startDate: { $gte: filterDate },

      bookingStatus: { $ne: "booked" },
      $or: [
        {
          visitStatus: "pending",
        },
        {
          revisitStatus: "pending",
        },
      ],
    });

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
          visit2Count,
          pendingCount,
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
    let limit = parseInt(req.query.limit) || 10;
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
      .populate(leadPopulateOptions);

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
    // console.log(approvalStatus);
    let stage = req.query.stage?.toLowerCase();
    let channelPartner = req.query.channelPartner?.toLowerCase();
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
      ...(channelPartner ? { channelPartner: channelPartner } : {}),
      // ...(stage ? { stage: stage } : { stage: { $ne: "tagging-over" } }),
      ...(stage === "all" ? { stage: stage } : { leadType: { $ne: "walk-in" } }),
    };

    // Execute the search with the refined filter
    const respCP = await leadModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 })
      .populate(leadPopulateOptions);

    // Count the total items matching the filter
    // const totalItems = await leadModel.countDocuments(searchFilter);

    // Count the total items matching the filter
    const totalItems = await leadModel.countDocuments({
      stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
    });
    // const totalItems = await leadModel.countDocuments(searchFilter);
    const rejectedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "rejected" },
        { stage: { $ne: "tagging-over" } },
        { leadType: { $ne: "walk-in" } },
      ],
    });

    const pendingCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "pending" },
        { stage: { $ne: "tagging-over" } },
        { leadType: { $ne: "walk-in" } },
      ],
    });

    const approvedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "approved" },
        { stage: { $ne: "tagging-over" } },
        { leadType: { $ne: "walk-in" } },
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

export const searchLeadsChannelPartner = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "id required"));

    let query = req.query.query || "";
    let status = req.query.approvalStatus?.toLowerCase();
    let stage = req.query.stage?.toLowerCase();

    // console.log("stage" + stage);
    // console.log("statys" + status);
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 3);

    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);
    let statusToFind = null;

    if (status === "approved") {
      statusToFind = {
        approvalStatus: { $eq: "approved" },
      };
    } else if (status === "rejected") {
      statusToFind = {
        approvalStatus: { $eq: "rejected" },
      };
    } else if (status === "pending") {
      statusToFind = {
        $and: [
          {
            approvalStatus: { $eq: "pending" },
          },
          {
            stage: { $eq: "approval" },
          },

          // {
          //   visitStatus: { $eq: "pending" },
          // },
          // { revisitStatus: { $eq: "pending" } },
          // {
          //   bookingStatus: { $ne: "booked" },
          // },
        ],
      };
    } else if (status === "revisit-pending" || status === "visit-done") {
      // console.log("ersi pendding");
      statusToFind = {
        stage: { $eq: "revisit" },
        revisitStatus: { $eq: "pending" },
      };
    } else if (status === "visit-pending") {
      // console.log("visi pendding");
      statusToFind = {
        stage: { $eq: "visit" },
        visitStatus: { $eq: "pending" },
      };
    } else if (status == "booking-pending" || status == "revisit-done") {
      // console.log("booi pendding");
      statusToFind = {
        stage: { $eq: "booking" },
        bookingStatus: { $eq: "pending" },
      };
    } else if (status == "booking-done") {
      // console.log("booi pendding");
      statusToFind = {
        stage: { $eq: "booking" },
        bookingStatus: { $eq: "booked" },
      };
    } else if (status == "line-up") {
      // console.log("booi pendding");
      statusToFind = {
        siteVisitInterested: true,
      };
    }

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
      ...(statusToFind != null ? statusToFind : null),
      $or: orFilters,

      // ...(approvalStatus && {
      //   approvalStatus: { $regex: approvalStatus, $options: "i" },
      // }),

      // $or:orFilters,
      // ...(revisitStatus&&{
      //   revisitStatus: { $regex: revisitStatus, $options: "i" },
      // }),
      // $or:orFilters,
      // ...(bookingStatus&&{
      //   bookingStatus: { $regex: bookingStatus, $options: "i" },
      // }),

      // ...(stage ? { stage: stage } : { stage: { $ne: "tagging-over" } }),
      leadType: { $ne: "walk-in" },
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
    };
    // console.log(searchFilter);
    // Execute the search with the refined filter
    const respCP = await leadModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ startDate: -1 })
      .populate(leadPopulateOptions);
    // console.log(respCP.length);

    // Count the total items matching the filter
    // const totalItems = await leadModel.countDocuments(searchFilter);

    // Count the total items matching the filter
    const totalItems = await leadModel
      .countDocuments({
        stage: { $ne: "tagging-over" },
        leadType: { $ne: "walk-in" },
        channelPartner: id,
        startDate: { $gte: sixMonthsAgo },
      })
      .sort({ startDate: -1 });
    // const totalItems = await leadModel.countDocuments(searchFilter);
    const rejectedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "rejected" },
        { stage: { $ne: "tagging-over" } },
        { leadType: { $ne: "walk-in" } },
        { channelPartner: id },
        { startDate: { $gte: sixMonthsAgo } },
      ],
    });

    const pendingCount = await leadModel.countDocuments({
      // stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
      channelPartner: id,
      startDate: { $gte: sixMonthsAgo },
      $and: [
        { stage: "approval" },
        { approvalStatus: "pending" },
        // { visitStatus: "pending" },
        // { revisitStatus: "pending" },
        // { bookingStatus: { $ne: "booked" } },
      ],
    });

    const approvedCount = await leadModel.countDocuments({
      $and: [
        { approvalStatus: "approved" },
        { stage: { $ne: "tagging-over" } },
        { leadType: { $ne: "walk-in" } },
        { channelPartner: id },
        { startDate: { $gte: sixMonthsAgo } },
      ],
    });

    const visitedCount = await leadModel.countDocuments({
      visitStatus: "visited",
      stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
      channelPartner: id,
      startDate: { $gte: sixMonthsAgo },
    });

    const revisitedCount = await leadModel.countDocuments({
      revisitStatus: "revisited",
      stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
      channelPartner: id,
      startDate: { $gte: sixMonthsAgo },
    });

    const bookedCount = await leadModel.countDocuments({
      bookingStatus: "booked",
      stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
      channelPartner: id,
      startDate: { $gte: sixMonthsAgo },
    });

    const lineUpCount = await leadModel.countDocuments({
      stage: { $ne: "tagging-over" },
      leadType: { $ne: "walk-in" },
      channelPartner: id,
      startDate: { $gte: sixMonthsAgo },
      siteVisitInterested: true,
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
        visitedCount,
        revisitedCount,
        bookedCount,
        // assignedCount,
        rejectedCount,
        lineUpCount,
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
    const respLead = await leadModel.findById(id).populate(leadPopulateOptions);

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
      .populate(leadPopulateOptions);

    return res.send(
      successRes(200, "Similar Leads", {
        data: similarLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getSiteVisitLeadByPhoneNumber = async (req, res) => {
  const phoneNumber = req.params.id;
  try {
    if (!phoneNumber) return res.send(errorRes(403, "id is required"));

    const respSite = await leadModel
      .findOne({ phoneNumber: phoneNumber })
      .populate(leadPopulateOptions);

    if (!respSite)
      return res.send(
        successRes(404, `Site vist not found with id:${phoneNumber}`, {
          data: respSite,
        })
      );
    return res.send(
      successRes(200, "lead by id", {
        data: respSite,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
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
    leadType,
  } = body;
  // console.log("p2");

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    console.log(body);

    const validFields = validateRequiredLeadsFields(body);
    // console.log("p3");

    if (!validFields.isValid) {
      return res.send(errorRes(400, validFields.message));
    }
    // console.log("p4");

    const currentDate = new Date();
    const ninetyOneDaysAgo = new Date(currentDate);
    ninetyOneDaysAgo.setDate(currentDate.getDate() - 91);

    const sixtyDaysAgo = new Date(currentDate);
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // console.log("p5");
    // Condition 1: Check if the same CP is trying to create the same lead within 91 days
    if (channelPartner) {
      const timeZone = "Asia/Kolkata";

      // Get yesterday's date range in local timezone
      const startOfToday = moment().tz(timeZone).startOf("day").toDate();
      const endOfToday = moment().tz(timeZone).endOf("day").toDate();

      const todayLeadsCount = await leadModel.countDocuments({
        channelPartner: channelPartner,
        startDate: { $gte: startOfToday, $lt: endOfToday },
      });

      if (todayLeadsCount >= 25) {
        return res.send(errorRes(409, `You cannot share more than 25 leads in 1 day.`));
      }

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

    // console.log("p6");

    // Condition 2: Check if a different CP created a lead with the same phone number within 60 days
    const existingLeadForOtherCP = await leadModel.findOne({
      phoneNumber: phoneNumber,
      channelPartner: { $ne: channelPartner }, // Other CPs
      startDate: {
        $gte: sixtyDaysAgo,
        $lte: currentDate,
      },
    });
    // console.log("p7");

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
        console.log(foundTLPlayerId);
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
    // console.log("p8");

    // Condition 3: If no existing lead exists, create a new one
    const newLead = await leadModel.create({
      ...body,
      leadType: leadType?.toLowerCase() ?? "cp",
    });
    // console.log("p9");

    const dataAnalyser = await employeeModel
      .find({
        designation: "desg-data-analyzer",
      })
      .sort({ createdAt: 1 });
    // console.log("p10");

    const getIds = dataAnalyser.map((dt) => dt._id.toString());
    const foundTLPlayerId = await oneSignalModel.find({
      docId: { $in: getIds },
      // role: "employee",
    });
    // console.log("p11");

    if (foundTLPlayerId.length > 0) {
      console.log(foundTLPlayerId);
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
    // console.log(error);

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
    if (!updatedLead) return res.send(errorRes(404, `Lead not found with ID: ${id}`));

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
    const startDate = new Date(); // Current date

    // Update the lead by ID
    const updatedLead = await leadModel.findByIdAndUpdate(
      id,
      {
        ...body,
        approvalStatus: "rejected",
        approvalRemark: remark ?? "rejected",
        approvalDate: startDate,
        $addToSet: {
          approvalHistory: {
            employee: user?._id,
            approvedAt: startDate,
            remark: remark ?? "rejected",
          },
          updateHistory: {
            employee: user?._id,
            changes: `Lead Rejected`,
            updatedAt: startDate,
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
    if (!deletedLead) return res.send(errorRes(404, `Lead not found with ID: ${id}`));

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

export const leadAssignToTeamLeader = async (req, res, next) => {
  const id = req.params.id;
  const user = req.user;

  const { remark, teamLeaderId } = req.body;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    if (!teamLeaderId) return res.send(errorRes(403, "teamLeaderId is required"));

    const respLead = await leadModel.findById(id);

    if (!respLead) return res.send(errorRes(404, "No lead found"));

    const teamLeaderResp = await employeeModel.find({ _id: teamLeaderId });

    const startDate = new Date(); // Current date
    const daysToAdd = 14;

    // Properly calculate validTill
    const validTill = new Date(startDate);
    validTill.setDate(validTill.getDate() + daysToAdd);
    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        {
          teamLeader: teamLeaderId,
          dataAnalyzer: user?._id,
          approvalStatus: "approved",
          approvalRemark: remark ?? "approved",
          approvalDate: startDate,
          stage: "visit",
          $set: {
            cycle: {
              nextTeamLeader: null,
              stage: "visit",
              currentOrder: 1,
              teamLeader: teamLeaderId,
              startDate: startDate,
              validTill: validTill,
            },
          },
          $addToSet: {
            approvalHistory: {
              employee: user?._id,
              approvedAt: startDate,
              remark: remark ?? "approved",
            },
            updateHistory: {
              employee: user?._id,
              changes: `Lead Assign to Team Leader ${teamLeaderResp?.firstName} ${teamLeaderResp?.lastName}`,
              updatedAt: startDate,
              remark: remark,
            },
          },
        },
        { new: true, runValidators: true }
      )
      .populate(leadPopulateOptions);

    const foundTLPlayerId = await oneSignalModel.findOne({
      docId: teamLeaderResp?._id,
      // role: teamLeaderResp?.role,
    });

    if (foundTLPlayerId) {
      // console.log(foundTLPlayerId);

      await sendNotificationWithImage({
        playerIds: [foundTLPlayerId.playerId],
        title: "You've Got a New Lead!",
        message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
        imageUrl:
          "https://img.freepik.com/premium-vector/checklist-with-check-marks-pencil-envelope-list-notepad_1280751-82597.jpg?w=740",
      });
      // console.log("pass sent notification");
    }

    return res.send(successRes(200, "Lead Assigned Successfully", { data: updatedLead }));
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
          .populate(leadPopulateOptions);

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
        populate: [{ path: "designation" }, { path: "department" }, { path: "division" }],
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
      .populate(leadPopulateOptions);

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

  const { leadStage, remark, feedback, siteVisit, documentUrl, recordingUrl } = body;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    if (!leadStage) return res.send(errorRes(403, "Lead Stage is required"));
    if (!remark) return res.send(errorRes(403, "Lead Status is required"));
    if (!feedback) return res.send(errorRes(403, "Feedback is required"));
    // if (!siteVisit) return res.send(errorRes(403, "Site Visit is required"));

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
              remark: remark, // Include leadStatus
              feedback: feedback,
              // siteVisit: siteVisit, // Include siteVisit
              document: documentUrl, // Store the document URL
              recording: recordingUrl, // Store the recording URL
            },
          },
        },
        { new: true }
      )
      .populate(leadPopulateOptions);

    if (!updatedLead) {
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));
    }

    return res.send(
      successRes(200, `Caller updated successfully: ${id}`, {
        data: updatedLead,
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
            $concat: ["$teamLeaderDetails.firstName", " ", "$teamLeaderDetails.lastName"],
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
      return res.status(400).json({ message: "Invalid year or month parameter" });
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
        month: found ? found.month : interval === "monthly" ? currentMonth : undefined,
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
export async function getLeadCountsByChannelPartnerById(req, res, next) {
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

    // Calculate the default range for the last three months
    const currentDate = new Date();
    const defaultEndDate = currentDate;
    const defaultStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 2,
      1
    );
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

    let matchStage = {
      channelPartner: teamLeaderId, // Match by team leader ID
    };

    if (interval === "weekly") {
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 7); // Limit to current week (Mon-Sun)
      matchStage.startDate = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "monthly") {
      matchStage.startDate = {
        $gte: startDate ? new Date(startDate) : defaultStartDate,
        $lt: endDate ? new Date(endDate) : defaultEndDate,
      };
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
    console.error("Error getting lead counts by Channel Partner:", error);
    next(error);
  }
}

// export async function getLeadCountsByChannelPartnerById(req, res, next) {
//   try {
//     const teamLeaderId = req.params.id;
//     const { interval = "monthly", year, startDate, endDate } = req.query;
//     const currentYear = new Date().getFullYear();

//     // Validate teamLeaderId parameter
//     if (!teamLeaderId) {
//       return res.status(400).json({ message: "Team leader ID is required" });
//     }

//     // Validate year parameter only if it's provided
//     let selectedYear = currentYear;
//     if (year) {
//       selectedYear = parseInt(year, 10);
//       if (isNaN(selectedYear)) {
//         return res.status(400).json({ message: "Invalid year parameter" });
//       }
//     }

//     // Calculate the start of the current week (Monday)
//     const currentDate = new Date();
//     const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
//     const endOfCurrentWeek = addDays(startOfCurrentWeek, 7); // Limit to current week (Mon-Sun)

//     let matchStage = {
//       channelPartner: teamLeaderId, // Match by team leader ID
//     };

//     if (interval === "weekly") {
//       matchStage.startDate = {
//         $gte: startOfCurrentWeek,
//         $lt: endOfCurrentWeek,
//       };
//     } else if (interval === "monthly") {
//       if (startDate && endDate) {
//         matchStage.startDate = {
//           $gte: new Date(startDate),
//           $lt: new Date(endDate),
//         };
//       } else {
//         matchStage.startDate = {
//           $gte: new Date(`${selectedYear}-01-01`),
//           $lt: new Date(`${selectedYear + 1}-01-01`),
//         };
//       }
//     } else {
//       return res.status(400).json({ message: "Invalid interval parameter" });
//     }

//     let groupStage = {};
//     if (interval === "weekly") {
//       groupStage = {
//         _id: {
//           dayOfWeek: { $dayOfWeek: "$startDate" },
//           date: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
//         },
//         count: { $sum: 1 },
//       };
//     } else if (interval === "monthly") {
//       groupStage = {
//         _id: {
//           month: { $month: "$startDate" },
//           year: { $year: "$startDate" },
//         },
//         count: { $sum: 1 },
//       };
//     }

//     const leadCounts = await leadModel.aggregate([
//       { $match: matchStage },
//       { $group: groupStage },
//       { $sort: { "_id.date": 1, "_id.month": 1, "_id.dayOfWeek": 1 } },
//     ]);

//     // Prepare a full weekly structure with zero counts for missing days
//     const dayMap = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     let weekData = Array.from({ length: 7 }, (_, i) => {
//       const date = addDays(startOfCurrentWeek, i);
//       return {
//         date: format(date, "yyyy-MM-dd"),
//         day: dayMap[(i + 1) % 7], // Adjust for MongoDB's $dayOfWeek (1 = Sunday)
//         count: 0,
//       };
//     });

//     // Populate `weekData` with actual counts where available
//     leadCounts.forEach((item) => {
//       const foundDay = weekData.find((day) => day.date === item._id.date);
//       if (foundDay) foundDay.count = item.count;
//     });

//     if (interval === "weekly") {
//       return res.json(weekData); // Only send weekly data with all days accounted for
//     }

//     // Monthly data output
//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];

//     const formattedMonthlyData = leadCounts.map((item) => ({
//       year: item._id.year,
//       month: monthNames[item._id.month - 1], // Use month number to get month name
//       count: item.count,
//     }));

//     return res.send(
//       successRes(200, "ok", {
//         data: formattedMonthlyData,
//       })
//     );
//   } catch (error) {
//     console.error("Error getting lead counts by team leader:", error);
//     next(error);
//   }
// }

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
      return res.status(400).json({ message: "Invalid year or month parameter" });
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
    const allStatuses = ["Booked", "Site Visit", "Leads Contacted", "Leads Received"];

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
        month: found ? found.month : interval === "monthly" ? currentMonth : undefined,
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

export const getLeadByStartEndDate = async (req, res) => {
  const { startDate, endDate, teamLeader, status, project, channelPartner } = req.body;

  try {
    if (!startDate || !endDate)
      return res.send(errorRes(401, "start & end date required"));

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Status filter
    let statusToFind = {};
    if (status === "visit-pending") {
      statusToFind = { visitStatus: "pending" };
    } else if (status === "revisit-pending") {
      statusToFind = { revisitStatus: "pending" };
    } else if (status === "visited") {
      statusToFind = { visitStatus: { $ne: "pending" } };
    } else if (status === "revisited") {
      statusToFind = { revisitStatus: { $ne: "pending" } };
    } else if (status === "booking-done") {
      statusToFind = { bookingStatus: "booked" };
    } else if (status === "pending") {
      statusToFind = {
        bookingStatus: { $ne: "booked" },
        $or: [{ visitStatus: "pending" }, { revisitStatus: "pending" }],
      };
    } else if (status === "tagging-over" || status === "followup") {
      statusToFind = { stage: "tagging-over" };
    }

    // Project filter
    let projectFilter = {};
    if (project) {
      projectFilter = { project: { $in: project } };
    }

    // Team leader filter
    let teamLeaderFilter = {};
    if (teamLeader) {
      teamLeaderFilter = { teamLeader };
    }
    let channelPartnerFilter = {};

    if (channelPartner) {
      channelPartnerFilter = { channelPartner };
    }

    const resp = await leadModel
      .find({
        ...teamLeaderFilter,
        ...statusToFind,
        ...projectFilter,
        ...channelPartnerFilter,
        startDate: { $gte: start, $lt: end },
      })
      .sort({ startDate: -1 })
      .populate(leadPopulateOptions);

    return res.send(
      successRes(200, "leads", {
        totalItems: resp.length,
        data: resp,
      })
    );
  } catch (error) {
    res.send(error);
  }
};

export const generateInternalLeadPdf = async (req, res) => {
  try {
    const timeZone = "Asia/Kolkata";

    // Get yesterday's date range in local timezone
    const startOfYesterday = moment()
      .tz(timeZone)
      .subtract(1, "day")
      .startOf("day")
      .toDate();
    const endOfYesterday = moment().tz(timeZone).subtract(1, "day").endOf("day").toDate();
    console.log(startOfYesterday);
    console.log(endOfYesterday);

    console.log(
      moment("2024-12-10T20:39:57.938+00:00").tz(timeZone).format("DD-MM-YYYY HH:mm")
    );
    console.log(moment(startOfYesterday).tz(timeZone).format("DD-MM-YYYY HH:mm"));

    console.log(moment(endOfYesterday).tz(timeZone).format("DD-MM-YYYY HH:mm"));

    const leads = await leadModel
      .find({
        startDate: { $gte: startOfYesterday, $lt: endOfYesterday },
      })
      .populate(leadPopulateOptions);

    if (!leads.length) {
      return res.status(404).json({ message: "No leads found for yesterday" });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const pdfPath = path.join(__dirname, "leads-yesterday.pdf");
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);
    // Add title
    doc
      .fontSize(20)
      .text(
        `Internal Assigned Leads Report - ${moment(startOfYesterday)
          .tz(timeZone)
          .format("DD-MM-YYYY")}`,
        {
          align: "center",
          underline: true,
        }
      )
      .moveDown();

    let i = 1;
    leads.forEach((lead, index) => {
      if (doc.y > 700) {
        doc.fontSize(10).text(`Page ${i}`, 40, 780, {
          align: "right",
        });
        i++;

        doc.addPage();
      }
      // Draw card boundary
      doc.rect(40, doc.y, 510, 150).stroke().moveDown(0.5);

      const cardY = doc.y + 5;

      // Add lead details within the card
      doc
        .fontSize(12)
        .text(`Lead ${index + 1} out of ${leads.length}`, 50, cardY, {
          align: "left",
        })
        .text(`Name: ${lead.firstName || "N/A"} ${lead.lastName || ""}`, 50, cardY + 15)
        .text(
          `Phone: ${lead.countryCode + " " + lead.phoneNumber || "N/A"}`,
          50,
          cardY + 30
        )
        .text(
          `Alt Phone: ${
            lead.altPhoneNumber ? lead.countryCode + " " + lead.altPhoneNumber : "N/A"
          }`,
          50,
          cardY + 45
        )

        .text(`Email: ${lead.email || "N/A"}`, 50, cardY + 60)
        .text(
          `Projects: ${lead.project?.map((proj) => proj.name)?.join(", ") || "N/A"}`,
          50,
          cardY + 75
        )
        .text(`Requirement: ${lead.requirement?.join(", ") || "N/A"}`, 50, cardY + 90)

        .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 15)
        .text(
          `Data Analyzer: ${
            (lead.dataAnalyzer?.firstName ?? "") +
              " " +
              (lead.dataAnalyzer?.lastName ?? "") || "N/A"
          }`,
          300,
          cardY + 30
        )
        .text(
          `Team Leader: ${
            (lead.teamLeader?.firstName ?? "") +
              " " +
              (lead.teamLeader?.lastName ?? "") || "N/A"
          }`,
          300,
          cardY + 45
        )

        .text(
          `Channel Partner: ${lead.channelPartner?.firmName || "N/A"}`,
          300,
          cardY + 60
        )
        // .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 60)
        .text(
          `Assigned Date: ${
            lead.cycle?.startDate
              ? moment(lead.cycle.startDate).tz(timeZone).format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 75
        )
        .text(
          `Deadline: ${
            lead.cycle?.validTill
              ? moment(lead.cycle.validTill).tz(timeZone).format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 90
        );

      // Add some spacing between cards
      doc.moveDown(4);
    });

    doc.end();

    pdfStream.on("finish", () => {
      res.download(pdfPath, "leads-yesterday.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading file.");
        }
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateChannelPartnerLeadPdf = async (req, res) => {
  try {
    const timeZone = "Asia/Kolkata";

    // Get yesterday's date range in local timezone
    const startOfYesterday = moment()
      .tz(timeZone)
      .subtract(1, "day")
      .startOf("day")
      .toDate();
    const endOfYesterday = moment().tz(timeZone).subtract(1, "day").endOf("day").toDate();

    const leads = await leadModel
      .find({
        startDate: { $gte: startOfYesterday, $lt: endOfYesterday },
        channelPartner: { $ne: null },
      })
      .populate(leadPopulateOptions);

    if (!leads.length) {
      return res.status(404).json({ message: "No leads found for yesterday" });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const pdfPath = path.join(__dirname, "leads-yesterday.pdf");
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // Add title
    doc
      .fontSize(20)
      .text(
        `Channel Partner Leads Report - ${moment(startOfYesterday)
          .tz(timeZone)
          .format("DD-MM-YYYY")}`,
        {
          align: "center",
          underline: true,
        }
      )
      .moveDown();
    let i = 1;
    // Iterate through leads and add as card-style layout
    leads.forEach((lead, index) => {
      if (doc.y > 700) {
        doc.fontSize(10).text(`Page ${i}`, 40, 780, {
          align: "right",
        });
        i++;

        doc.addPage(); // Add new page if content exceeds height
      }

      // Draw card boundary
      doc.rect(40, doc.y, 510, 150).stroke().moveDown(0.5);

      const cardY = doc.y + 5;

      // Add lead details within the card
      doc
        .fontSize(12)
        .text(`Lead ${index + 1} out of ${leads.length}`, 50, cardY, {
          align: "left",
        })
        .text(`Name: ${lead.firstName || "N/A"} ${lead.lastName || ""}`, 50, cardY + 15)
        .text(
          `Phone: ${lead.countryCode + " " + lead.phoneNumber || "N/A"}`,
          50,
          cardY + 30
        )
        .text(
          `Alt Phone: ${
            lead.altPhoneNumber ? lead.countryCode + " " + lead.altPhoneNumber : "N/A"
          }`,
          50,
          cardY + 45
        )

        .text(`Email: ${lead.email || "N/A"}`, 50, cardY + 60)
        .text(
          `Projects: ${lead.project?.map((proj) => proj.name)?.join(", ") || "N/A"}`,
          50,
          cardY + 75
        )
        .text(`Requirement: ${lead.requirement?.join(", ") || "N/A"}`, 50, cardY + 90)

        .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 15)
        .text(
          `Data Analyzer: ${
            lead.dataAnalyzer?.firstName + " " + lead.dataAnalyzer?.lastName || "N/A"
          }`,
          300,
          cardY + 30
        )
        .text(
          `Team Leader: ${
            lead.teamLeader?.firstName + " " + lead.teamLeader?.lastName || "N/A"
          }`,
          300,
          cardY + 45
        )

        .text(
          `Channel Partner: ${lead.channelPartner?.firmName || "N/A"}`,
          300,
          cardY + 60
        )
        // .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 60)
        .text(
          `Tagging Date: ${
            lead.startDate
              ? moment(lead.startDate).tz(timeZone).format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 75
        )
        .text(
          `Valid Till: ${
            lead.validTill
              ? moment(lead.validTill).tz(timeZone).format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 90
        );

      // Add some spacing between cards
      doc.moveDown(4);
    });

    doc.end();

    pdfStream.on("finish", () => {
      res.download(pdfPath, "leads-yesterday.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading file.");
        }
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function getStatus1(lead) {
  if (lead.stage == "visit") {
    return `${lead.stage ?? ""} ${lead.visitStatus ?? ""}`;
  } else if (lead.stage == "revisit") {
    return `${lead.stage ?? ""} ${lead.revisitStatus ?? ""}`;
  } else if (lead.stage == "booking") {
    return `${lead.stage ?? ""} ${lead.bookingStatus ?? ""}`;
  }

  return `${lead.stage ?? ""} ${lead.visitStatus ?? ""}`;
}

export const triggerCycleChange = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const filterDate = new Date("2024-12-10");

    // Fetch all leads whose cycles have expired
    const allCycleExpiredLeads = await leadModel.find({
      "cycle.validTill": { $lt: currentDate },
      startDate: { $gte: filterDate },
      bookingStatus: { $ne: "booked" },
    });

    if (allCycleExpiredLeads.length > 0) {
      // Fetch active team leaders sorted by createdAt
      const teamLeaders = [
        { _id: "ev15-deepak-karki" },
        { _id: "ev69-vicky-mane" },
        { _id: "ev70-jaspreet-arora" },
        { _id: "ev54-ranjna-gupta" },
      ];
      // const teamLeaders = await employeeModel
      //   .find({
      //     $or: [
      //       { designation: "desg-site-head" },
      //       { designation: "desg-senior-closing-manager" },
      //       { designation: "desg-post-sales-head" },
      //     ],
      //     status: "active",
      //   })
      //   .sort({ createdAt: 1 })
      //   .select("_id");

      console.log("Team Leaders:", teamLeaders); // Debug log

      // Prepare bulk operations
      const bulkOperations = [];

      allCycleExpiredLeads.map((entry) => {
        const lastIndex = teamLeaders.findIndex(
          (ele) => ele?._id.toString() === entry?.cycle?.teamLeader?.toString()
        );
        const totalTeamLeader = teamLeaders.length;
        const cCycle = { ...entry.cycle }; // Clone cycle object

        const previousCycle = { ...cCycle }; // For cycle history
        const startDate = new Date(entry.cycle.validTill); // Current date
        const validTill = new Date(startDate);

        if (lastIndex !== -1) {
          // Logic for visit stage
          if (cCycle.stage === "visit") {
            if (cCycle.currentOrder >= totalTeamLeader) {
              validTill.setDate(validTill.getDate() + 180);
              cCycle.currentOrder = 1;
              cCycle.lastIndex = lastIndex;
              cCycle.teamLeader = teamLeaders[0]?._id; // Reset to first TL
              // cCycle.oldTeamLeader = cCycle.teamLeader; // Reset to first TL
            } else {
              cCycle.currentOrder += 1;
              cCycle.teamLeader = teamLeaders[lastIndex + 1]?._id || teamLeaders[0]?._id;
              // cCycle.oldTeamLeader = cCycle.teamLeader;
              // cCycle.lastIndex = lastIndex;
              // cCycle.nextIndex = lastIndex + 1;

              switch (cCycle.currentOrder) {
                case 1:
                  validTill.setDate(validTill.getDate() + 14);
                  break;
                case 2:
                  validTill.setDate(validTill.getDate() + 6);
                  break;
                case 3:
                  validTill.setDate(validTill.getDate() + 3);
                  break;
                case 4:
                  validTill.setDate(validTill.getDate() + 1);
                  break;
                default:
                  validTill.setDate(validTill.getDate() + 14);
              }
            }
          } else if (cCycle.stage === "revisit") {
            // Logic for revisit stage
            if (cCycle.currentOrder >= totalTeamLeader) {
              validTill.setDate(validTill.getDate() + 180);
              cCycle.currentOrder = 1;
              cCycle.teamLeader = teamLeaders[0]?._id; // Reset to first TL
              cCycle.lastIndex = lastIndex;
            } else {
              cCycle.currentOrder += 1;
              cCycle.teamLeader = teamLeaders[lastIndex + 1]?._id || teamLeaders[0]?._id;
              cCycle.lastIndex = lastIndex;
              cCycle.nextIndex = lastIndex + 1;

              switch (cCycle.currentOrder) {
                case 1:
                  validTill.setDate(validTill.getDate() + 29);
                  break;
                case 2:
                  validTill.setDate(validTill.getDate() + 14);
                  break;
                case 3:
                  validTill.setDate(validTill.getDate() + 6);
                  break;
                case 4:
                  validTill.setDate(validTill.getDate() + 3);
                  break;
                default:
                  validTill.setDate(validTill.getDate() + 29);
              }
            }
          }

          cCycle.startDate = startDate;
          cCycle.validTill = validTill;

          // Add bulk update operation
          bulkOperations.push({
            updateOne: {
              filter: { _id: entry._id },
              update: {
                teamLeader: cCycle.teamLeader,
                $set: { cycle: cCycle },
                $push: { cycleHistory: previousCycle }, // Add previous cycle to history
              },
            },
          });
        }
      });

      // Execute bulk update
      if (bulkOperations.length > 0) {
        const bulkResult = await leadModel.bulkWrite(bulkOperations);
        // console.log("Bulk Update Result:", bulkResult);

        return res.send(
          successRes(200, "Cycles updated successfully", {
            matchedCount: bulkResult.matchedCount,
            modifiedCount: bulkResult.modifiedCount,
            total: bulkOperations?.length,
            data: bulkOperations,
          })
        );
      }
    }

    // If no leads need cycle changes
    return res.send(
      successRes(200, "No cycle changes needed", {
        data: [],
        totalItem: 0,
      })
    );
  } catch (error) {
    console.error("Error updating cycles:", error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
};

export const getCpSalesFunnel = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "channel partner required"));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 3);

    // Count the total items matching the filter
    const bookingDone = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      bookingStatus: { $ne: "pending" },
    });
    const visitDone = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      visitStatus: { $ne: "pending" },
    });
    const contacted = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      callHistory: {
        $exists: true,
        $not: { $size: 0 },
      },
    });
    const received = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      leadType: { $ne: "walk-in" },
    });
    const interested = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      clientInterestedStatus: { $eq: "interested" },
    });
    const notInterested = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      clientInterestedStatus: { $eq: "not-interested" },
    });
    const followup = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      // callHistory: { $gte: 1 },
      followupStatus: { $eq: "followup" },
    });
    const revisitDone = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      // callHistory: { $gte: 1 },
      revisitStatus: { $eq: "revisited" },
    });
    const approvalCount = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      // callHistory: { $gte: 1 },
      approvalStatus: { $eq: "approved" },
    });
    const rejectedCount = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      // callHistory: { $gte: 1 },
      approvalStatus: { $eq: "rejected" },
    });
    const pendingCount = await leadModel.countDocuments({
      startDate: { $gte: sixMonthsAgo },
      channelPartner: id,
      // callHistory: { $gte: 1 },
      approvalStatus: { $eq: "pending" },
    });

    // const booking=await leadModel.findById(_id).populate(leadPopulateOptions);

    // itreseted, not intrested

    return res.send({
      data: {
        bookingDone,
        revisitDone,
        visitDone,
        contacted,
        received,
        interested,
        notInterested,
        followup,
        approvalCount,
        rejectedCount,
        pendingCount,
      },
    });
  } catch (error) {
    return res.send(errorRes(error));
  }
};

export const get24hrLeadsNameList = async (req, res, next) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 360);

    // Count the total items matching the filter
    const list = await leadModel
      .find({
        leadType: "cp",
        startDate: { $gte: oneDayAgo },
        channelPartner: { $ne: null },
      })
      .select("channelPartner")
      .populate({
        path: "channelPartner",
        select: "firmName",
      });
    // itreseted, not intrested
    const newList = list.map(
      (ele) => `${ele.channelPartner.firmName} just shared a Lead`
    );
    return res.send(
      successRes(200, "got", {
        data: newList,
      })
    );
  } catch (error) {
    console.log(error);
    return res.send(errorRes(error));
  }
};

export const triggerCycleChangeFunction = async () => {
  try {
    // const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() - 6);
    const filterDate = new Date("2024-12-10");
    const timeZone = "Asia/Kolkata";

    // const startOfYesterday = moment()
    //   .tz(timeZone)
    //   .subtract(1, "day")
    //   .startOf("day")
    //   .toDate();
    const endOfYesterday = moment().tz(timeZone).subtract(1, "day").endOf("day").toDate();

    const actualTriggerQuery = {
      startDate: { $gte: filterDate },
      bookingStatus: { $ne: "booked" },
      "cycle.validTill": { $lte: endOfYesterday },
    };
    console.log(actualTriggerQuery);

    const allCycleExpiredLeads = await leadModel.find({
      ...actualTriggerQuery,
    });

    if (allCycleExpiredLeads.length > 0) {
      const teamLeaders = [
        { _id: "ev15-deepak-karki" },
        { _id: "ev69-vicky-mane" },
        { _id: "ev70-jaspreet-arora" },
        { _id: "ev54-ranjna-gupta" },
      ];

      const bulkOperations = [];

      allCycleExpiredLeads.forEach((entry) => {
        const lastIndex = teamLeaders.findIndex(
          (ele) => ele?._id.toString() === entry?.cycle?.teamLeader?.toString()
        );
        const totalTeamLeader = teamLeaders.length;
        const cCycle = { ...entry.cycle };
        const previousCycle = { ...cCycle };
        const firstTeamLeader = entry.cycleHistory[0]?.teamLeader;
        const lastTeamLeaderNext = teamLeaders[0]._id;
        const startDate = new Date(entry.cycle.validTill.addDays(1));
        const validTill = new Date(startDate);

        if (lastIndex !== -1) {
          if (cCycle.stage === "visit") {
            if (cCycle.currentOrder >= totalTeamLeader) {
              validTill.setMonth(validTill.getMonth() + 5);
              cCycle.currentOrder += 1;
              cCycle.teamLeader = firstTeamLeader;
            } else {
              cCycle.currentOrder += 1;

              if (lastIndex + 1 >= 4) {
                cCycle.teamLeader = lastTeamLeaderNext;
              } else {
                cCycle.teamLeader = teamLeaders[lastIndex + 1]?._id || firstTeamLeader;
              }

              switch (cCycle.currentOrder) {
                case 1:
                  validTill.setDate(validTill.getDate() + 14);
                  break;
                case 2:
                  validTill.setDate(validTill.getDate() + 6);
                  break;
                case 3:
                  validTill.setDate(validTill.getDate() + 2);
                  break;
                case 4:
                  validTill.setDate(validTill.getDate() + 1);
                  break;
                default:
                  validTill.setDate(validTill.getDate() + 14);
              }
            }
          } else if (cCycle.stage === "revisit") {
            if (cCycle.currentOrder >= totalTeamLeader) {
              validTill.setMonth(validTill.getMonth() + 5);
              cCycle.currentOrder += 1;
              cCycle.teamLeader = firstTeamLeader;
            } else {
              cCycle.currentOrder += 1;
              if (lastIndex + 1 >= 4) {
                cCycle.teamLeader = lastTeamLeaderNext;
              } else {
                cCycle.teamLeader = teamLeaders[lastIndex + 1]?._id || firstTeamLeader;
              }

              // cCycle.teamLeader =
              //   teamLeaders[lastIndex + 1]?._id || firstTeamLeader;

              switch (cCycle.currentOrder) {
                case 1:
                  validTill.setDate(validTill.getDate() + 30);
                  break;
                case 2:
                  validTill.setDate(validTill.getDate() + 14);
                  break;
                case 3:
                  validTill.setDate(validTill.getDate() + 6);
                  break;
                case 4:
                  validTill.setDate(validTill.getDate() + 2);
                  break;
                default:
                  validTill.setDate(validTill.getDate() + 30);
              }
            }
          }

          // Explicitly handle year rollover
          const adjustedYear = validTill.getFullYear();
          if (adjustedYear > startDate.getFullYear()) {
            console.log(`Year adjusted: ${startDate.getFullYear()} -> ${adjustedYear}`);
            validTill.setFullYear(adjustedYear);
          }

          cCycle.startDate = startDate;
          cCycle.validTill = validTill;

          bulkOperations.push({
            updateOne: {
              filter: { _id: entry._id },
              // ok: entry?.cycleHistory[0],
              update: {
                // lastIndex,
                // lastIndex2: lastIndex + 1,
                teamLeader: cCycle.teamLeader,
                taskRef: null,
                $set: { cycle: cCycle },
                $push: { cycleHistory: previousCycle },
              },
            },
          });
        }
      });

      if (bulkOperations.length > 0) {
        const bulkResult = await leadModel.bulkWrite(bulkOperations);
        const list = bulkOperations.map((ele) => ele?.updateOne?.filter?._id) ?? [];

        return {
          matchedCount: bulkResult.matchedCount,
          modifiedCount: bulkResult.modifiedCount,
          total: bulkOperations.length,
          changes: list,
          changesString: JSON.stringify(bulkOperations),
          data: bulkOperations,
          message: "cycle changed successfully",
        };
      }
    }

    return {
      total: 0,
      changes: [],
      changesString: "no cycle changes",
      data: [],
      message: "no cycle changes",
    };
  } catch (error) {
    console.error("Error updating cycles:", error);
    throw new Error("Internal Server Error");
  }
};
