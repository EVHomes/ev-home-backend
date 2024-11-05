import postSaleLeadModel from "../model/postSaleLead.model.js";
import { errorRes, successRes } from "../model/response.js";
import { startOfWeek, addDays, format } from "date-fns";

export const getPostSaleLeads = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    let skip = (page - 1) * limit;

    const resp = await postSaleLeadModel
      .find()
      .sort({ date: -1 })
      .populate({
        path: "project",
        // select: "name",
      })
      .populate({
        path: "closingManager",
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
    // .skip(skip)
    // .limit(limit)

    // Count the total items matching the filter
    const totalItems = await postSaleLeadModel.countDocuments({
      // teamLeader: { $eq: teamLeaderId },
    });
    const registrationDone = await postSaleLeadModel.countDocuments({
      bookingStatus: "Registration Done",
    });
    const eoiRecieved = await postSaleLeadModel.countDocuments({
      bookingStatus: "EOI Recieved",
    });
    const cancelled = await postSaleLeadModel.countDocuments({
      bookingStatus: "Cancelled",
    });
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get post sale leads", {
        page,
        limit,
        totalItems,
        totalPages,
        registrationDone,
        eoiRecieved,
        cancelled,
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const addPostSaleLead = async (req, res, next) => {
  const body = req.body;
  const {
    firstName,
    lastName,
    email,
    unitNo,
    project,
    address,
    carpetArea,
    flatCost,
    phoneNumber,
  } = body;
  try {
    if (!body) return res.send(errorRes(401, "No Data Provided"));
    // console.log(body);
    if (body.applicants == null && body.applicants.length < 0)
      return res.send(errorRes(401, "Aplicant cant be empty"));

    // const resp = await postSaleLeadModel.find();
    const resp = await postSaleLeadModel.create({
      ...body,
    });

    // const newLead = postSaleLeadModel.findById(resp._id);

    // .populate({
    //   path: "closingManager",
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
    // });

    return res.send(
      successRes(200, "add post sale leads", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updatePostSaleLeadById = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  try {
    console.log("entered");
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    const foundLead = await postSaleLeadModel.findById(id);
    console.log("entered 1");

    if (!foundLead) return res.send(errorRes(404, "No lead found"));
    console.log("entered 2");
    console.log(body);
    await foundLead.updateOne({ ...body });

    return res.send(
      successRes(200, "updated post sale lead", {
        data: foundLead,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const deletePostSaleLeadBydId = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  try {
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    const foundLead = await postSaleLeadModel.findByIdAndDelete(id);

    if (!foundLead) return res.send(errorRes(404, "No lead found"));

    return res.send(
      successRes(200, "deleted post sale lead", {
        data: foundLead,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export async function getPostSaleLeadCounts(req, res, next) {
  try {
    const { interval, year, startDate, endDate } = req.query;
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
          dayOfWeek: { $dayOfWeek: "$date" },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
        count: { $sum: 1 },
      };
    } else if (interval === "monthly") {
      groupStage = {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        count: { $sum: 1 },
      };
    }

    const leadCounts = await postSaleLeadModel.aggregate([
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedMonthlyData = leadCounts.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1], // Use month number to get month name
      count: item.count,
    }));

    return res.json(formattedMonthlyData);
  } catch (error) {
    console.error("Error getting lead counts:", error);
    next(error);
  }
}
