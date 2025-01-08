import postSaleLeadModel from "../model/postSaleLead.model.js";
import { errorRes, successRes } from "../model/response.js";
import { startOfWeek, addDays, format } from "date-fns";
import { postSalePopulateOptions } from "../utils/constant.js";
import TargetModel from "../model/target.model.js";
import { updateFlatInfoByIdFlatNo } from "./ourProjects.controller.js";
import ourProjectModel from "../model/ourProjects.model.js";

export const getPostSaleLeads = async (req, res, next) => {
  try {
    let query = req.query.query || "";
    let project = req.query.project; // Get the project name from the query
    let page = parseInt(req.query.page) || 1; // Start from page 1
    let limit = parseInt(req.query.limit) || 20;
    console.log(project);
    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);

    let searchFilter = {
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { address: new RegExp(query, "i") },
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
        {
          applicants: {
            $elemMatch: {
              $or: [
                { firstName: new RegExp(query, "i") },
                { lastName: new RegExp(query, "i") },
                { email: new RegExp(query, "i") },
                { address: new RegExp(query, "i") },
              ].filter(Boolean),
            },
          },
        },
      ].filter(Boolean),
      ...(project ? { project: project } : {}),
    };

    const resp = await postSaleLeadModel
      .find(searchFilter)
      .sort({ date: -1 })
      .populate(postSalePopulateOptions)
      .skip(skip)
      .limit(limit);

    // Count the total items matching the filter
    const totalItems = await postSaleLeadModel.countDocuments(searchFilter); // Count with the same filter
    const registrationDone = await postSaleLeadModel.countDocuments({
      bookingStatus: "Registration Done",
      ...(project ? { project: project } : {}),
    });
    const eoiRecieved = await postSaleLeadModel.countDocuments({
      bookingStatus: "EOI Recieved",
      ...(project ? { project: project } : {}),
    });
    const cancelled = await postSaleLeadModel.countDocuments({
      bookingStatus: "Cancelled",
      ...(project ? { project: project } : {}),
    });
    const report = await postSaleLeadModel.countDocuments({});
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

export const getPostSaleLeadById = async (req, res, next) => {
  try {
    const flatNo = req.params.flatNo;

    if (!flatNo) return res.send(errorRes(401, "Flat No Required"));

    const resp = await postSaleLeadModel
      .findOne({ unitNo: flatNo })
      .populate(postSalePopulateOptions);

    // Count the total items matching the filter
    console.log("data Sent");
    return res.send(
      successRes(200, "get post sale lead by id", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getPostSaleLeadsForExecutive = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) return res.send(errorRes(401, "Executive id required"));

    let query = req.query.query || "";
    let project = req.query.project;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);

    let searchFilter = {
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { address: new RegExp(query, "i") },
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
        {
          applicants: {
            $elemMatch: {
              $or: [
                { firstName: new RegExp(query, "i") },
                { lastName: new RegExp(query, "i") },
                { email: new RegExp(query, "i") },
                { address: new RegExp(query, "i") },
              ].filter(Boolean),
            },
          },
        },
      ].filter(Boolean),
      ...(project ? { project: project } : {}),
      postSaleExecutive: id,
    };

    const resp = await postSaleLeadModel
      .find(searchFilter)
      .sort({ date: -1 })
      .populate(postSalePopulateOptions)
      .skip(skip)
      .limit(limit);

    // Count the total items matching the filter
    const totalItems = await postSaleLeadModel.countDocuments(searchFilter); // Count with the same filter
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

export async function getLeadCounts(req, res, next) {
  try {
    let query = req.query.query || "";
    let project = req.query.project; // Get project from query params
    const { interval = "monthly", year, date, endDate } = req.query;
    const currentYear = new Date().getFullYear();

    console.log(date);

    // Validate and set the year
    let selectedYear = currentYear;
    if (year) {
      selectedYear = parseInt(year, 10);
      if (isNaN(selectedYear)) {
        return res.status(400).json({ message: "Invalid year parameter" });
      }
    }

    // Weekly date range (Monday to Sunday)
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = addDays(startOfCurrentWeek, 7);

    // Set match stage for MongoDB aggregation
    let matchStage = {};
    if (interval === "weekly") {
      matchStage.date = {
        $gte: startOfCurrentWeek,
        $lt: endOfCurrentWeek,
      };
    } else if (interval === "monthly") {
      if (date && endDate) {
        // Parse startDate and endDate
        const parsedStartDate = new Date(date);
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
          return res.status(400).json({ message: "Invalid date range" });
        }
        matchStage.date = {
          $gte: parsedStartDate,
          $lt: parsedEndDate,
        };
      } else {
        matchStage.date = {
          $gte: new Date(`${selectedYear}-01-01`),
          $lt: new Date(`${selectedYear + 1}-01-01`),
        };
      }
    } else {
      return res.status(400).json({ message: "Invalid interval parameter" });
    }

    // Add project filter if provided
    if (project) {
      matchStage.project = project;
    }

    // Group stage for MongoDB aggregation
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

    if (interval === "weekly") {
      // Weekly: fill missing days
      const dayMap = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(startOfCurrentWeek, i);
        return {
          date: format(date, "yyyy-MM-dd"),
          day: dayMap[i],
          count: 0,
        };
      });

      // Populate counts
      leadCounts.forEach((item) => {
        const foundDay = weekData.find((day) => day.date === item._id.date);
        if (foundDay) foundDay.count = item.count;
      });

      return res.json(weekData);
    }

    // Monthly: format data
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
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    console.log("Query Parameters:", {
      interval,
      year,
      date,
      endDate,
      project,
    });
    return res.send(successRes(200, "ok", { data: formattedMonthlyData }));
  } catch (error) {
    console.error("Error getting lead counts:", error);
    next(error);
  }
}

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
    floor,
    number,
  } = body;
  try {
    if (!body) {
      return res.send(errorRes(401, "No Data Provided"));
    }
    if (body.applicants == null || body.applicants?.length <= 0) {
      return res.send(errorRes(401, "Aplicant cant be empty"));
    }
    const findProject = await ourProjectModel.findById(project);

    if (findProject) {
      const findExisintFlat = findProject.flatList.find(
        (ele) => ele.floor === floor && ele.number === number
      );
      // if (findExisintFlat) {
      //   return res.send(
      //     errorRes(401, `Flat ${findExisintFlat.flatNo} is Already Booked`)
      //   );
      // }
    }

    // const resp = await postSaleLeadModel.find();
    const resp = await postSaleLeadModel.create({
      ...body,
    });

    const newLead = await postSaleLeadModel
      .findById(resp._id)
      .populate(postSalePopulateOptions);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const findTarget = await TargetModel.findOne({
      staffId: newLead.closingManager,
      month: currentMonth,
      year: currentYear,
    });

    if (findTarget != null) {
      findTarget.achieved += 1;
      findTarget.extraAchieved = Math.max(
        0,
        findTarget.achieved - findTarget.target
      );

      await findTarget.save();
    }

    await updateFlatInfoByIdFlatNo(project, unitNo, {
      occupied: true,
    });

    return res.send(
      successRes(200, "add post sale leads", {
        data: newLead,
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
    // console.log("entered");
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    const foundLead = await postSaleLeadModel.findById(id);

    // console.log("entered 1");

    if (!foundLead) return res.send(errorRes(404, "No lead found"));
    // console.log("entered 2");
    // console.log(body);
    await foundLead.updateOne({ ...body }, { new: true });
    const updatedLead = await postSaleLeadModel
      .findById(id)
      .populate(postSalePopulateOptions);

    return res.send(
      successRes(200, "updated post sale lead", {
        data: updatedLead,
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

export const getPostSaleLeadByFlat = async (req, res) => {
  try {
    const unitNo = req.query.unitNo;
    const project=req.query.project;
console.log(unitNo);
console.log(project);
    const respPayment = await postSaleLeadModel
      .findOne({ unitNo: unitNo,project:project})
      .populate(postSalePopulateOptions);
console.log(respPayment);
    return res.send(
      successRes(200, "Get Post Lead payment", {
        data: respPayment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
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
