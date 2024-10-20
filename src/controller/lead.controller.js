import employeeModel from "../model/employee.model.js";
import leadModel from "../model/lead.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import TeamLeaderAssignTurn from "../model/teamLeaderAssignTurn.model.js";
import { sendNotification } from "./oneSignal.controller.js";

export const getAllLeads = async (req, res, next) => {
  try {
    const respLeads = await leadModel
      .find()
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
        path: "dataAnalyser",
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

    if (!respLeads) return errorRes(404, "No leads found");

    return res.send(
      successRes(200, "all Leads", {
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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);

    let searchFilter = {
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        isNumberQuery ? { phoneNumber: Number(query) } : null,
        isNumberQuery ? { altPhoneNumber: Number(query) } : null,
        { email: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } },
        { interestedStatus: { $regex: query, $options: "i" } },
      ].filter(Boolean),
    };

    const respCP = await leadModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
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
        path: "dataAnalyser",
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

    // Count the total items matching the filter
    const totalItems = await leadModel.countDocuments(searchFilter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get Channel Partners", {
        page,
        limit,
        totalPages,
        totalItems,
        items: respCP,
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
        path: "dataAnalyser",
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

export const assignLeadToTeamLeader = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    const respLead = await leadModel.findById(id);
    if (!respLead) return res.send(errorRes(404, "No lead found"));

    if (respLead.teamLeader)
      return res.send(errorRes(401, "Team Leader is Already Assigned"));

    const teamLeaders = await employeeModel
      .find({
        designation: "670e5493de5adb5e87eb8d8c",
      })
      .sort({ createdAt: 1 });
    const whichTurn = await TeamLeaderAssignTurn.findOne({});

    // await respLead.updateOne(
    //   {
    //     teamLeader: teamLeaders[whichTurn.currentOrder]._id.toString(),
    //   },
    //   { new: true }
    // );

    const updatedLead = await leadModel
      .findByIdAndUpdate(
        id,
        { teamLeader: teamLeaders[whichTurn.currentOrder]._id.toString() },
        { new: true }
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
        path: "dataAnalyser",
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
      docId: teamLeaders[whichTurn.currentOrder]._id.toString(),
      role: teamLeaders[whichTurn.currentOrder].role,
    });

    if (foundTLPlayerId) {
      // console.log(foundTLPlayerId);
      await sendNotification({
        playerId: foundTLPlayerId.playerId,
        message: `New Lead is Assigned: for ${respLead.firstName} ${respLead.lastName}`,
      });
    }
    let nextOrder = whichTurn.currentOrder + 1;

    // Reset to 0 if nextOrder exceeds the length of teamLeaders
    if (nextOrder >= teamLeaders.length) {
      nextOrder = 0;
    }
    // Update the currentOrder in the database
    await whichTurn.updateOne({
      lastAssignTeamLeader: teamLeaders[whichTurn.currentOrder]._id.toString(),
      nextAssignTeamLeader: teamLeaders[nextOrder]._id.toString(),
      currentOrder: nextOrder,
    });

    return res.send(
      successRes(200, "lead assigned to TL", {
        data: updatedLead,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addLead = async (req, res) => {
  const body = req.body;
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    altPhoneNumber,
    remark,
    startDate,
    channelPartner,
    teamLeader,
    preSalesExecutive,
    validTill,
    status,
    project,
    interestedStatus,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));

    if (!email) return res.send(errorRes(403, "Email is required"));

    if (!firstName) return res.send(errorRes(403, "First name is required"));

    if (!lastName) return res.send(errorRes(403, "Last name is required"));

    if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));

    if (!project) return res.send(errorRes(403, "Project is required"));

    // Get current date and 60 days ago
    const currentDate = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Check if the lead exists with the conditions
    const existingLead = await leadModel.findOne({
      $or: [{ phoneNumber: phoneNumber }, { altPhoneNumber: phoneNumber }],
    });

    // if lead exist
    if (existingLead) {
      return res.send(
        errorRes(
          409,
          `Lead already exists with the following details:Phone Number: ${existingLead.phoneNumber} Alt Phone Number: ${existingLead.altPhoneNumber} Start Date: ${existingLead.startDate} Valid Till: ${existingLead.validTill} Status: ${existingLead.status}`
        )
      );
    }

    const newLead = await leadModel.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      altPhoneNumber,
      remark,
      channelPartner,
      status,
      interestedStatus,
      project,
      startDate: startDate || Date.now(),
      validTill: new Date(
        new Date(startDate || Date.now()).setMonth(new Date().getMonth() + 2)
      ),
    });

    // Save the new lead
    await newLead.save();

    return res.send(
      successRes(200, `Lead added successfully: ${firstName} ${lastName}`, {
        newLead,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const updateLead = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!body) return res.send(errorRes(403, "Data is required"));

    // Validate the required fields
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      altPhoneNumber,
      remark,
      status,
      interestedStatus,
    } = body;

    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));
    if (!status) return res.send(errorRes(403, "Status is required"));
    if (!interestedStatus)
      return res.send(errorRes(403, "Interested status is required"));
    if (!remark) return res.send(errorRes(403, "Remark is required"));

    // Update the lead by ID
    const updatedLead = await leadModel.findByIdAndUpdate(
      id,
      {
        email,
        firstName,
        lastName,
        phoneNumber,
        altPhoneNumber,
        remark,
        status,
        interestedStatus,
        startDate: body.startDate || Date.now(), // Use current date if not provided
        validTill: new Date(
          new Date(body.startDate || Date.now()).setMonth(
            new Date(body.startDate || Date.now()).getMonth() + 2
          )
        ),
      },
      { new: true } // Return the updated document
    );

    // Check if the lead was updated successfully
    if (!updatedLead) return res.send(errorRes(404, `Lead not found with ID: ${id}`));

    return res.send(
      successRes(200, `Lead updated successfully: ${firstName} ${lastName}`, {
        updatedLead,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const deleteLead = async (req, res) => {
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
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const checkLeadsExists = async (req, res) => {
  const { phoneNumber, altPhoneNumber } = req.params;
  try {
    if (!phoneNumber) return res.send(errorRes(403, "Phone Number is required"));

    const existingLead = await leadModel.findOne({
      $or: [
        {
          phoneNumber: phoneNumber,
        },
        {
          altPhoneNumber: phoneNumber,
        },
      ],
    });
    if (existingLead) {
      return res.send(
        errorRes(
          409,
          `Lead already exists with phone number: ${(phoneNumber, altPhoneNumber)}`
        )
      ); // 409 Conflict
    }

    // If no lead exists, you can return a success response or proceed with the next operation
    return res.send({
      code: 200,
      message: "No lead found with this phone number. You can proceed.",
    });
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

// export const getAllLeadsWithValidity = async (req, res, next) => {
//   try {
//     // Get the current date and calculate the date 60 days ago
//     const currentDate = new Date();
//     const sixtyDaysAgo = new Date();
//     sixtyDaysAgo.setDate(currentDate.getDate() - 60);

//     // Fetch all leads with phone numbers and validity dates (startDate, validTillDate)
//     const respLeads = await leadModel.find({
//       phoneNumber, altPhoneNumber, startDate, validTill, status}
//     );

//     if (!respLeads || respLeads.length === 0) {
//       return res.send(errorRes(404, "No leads found"));
//     }

//     // Filter leads that are within the last 60 days
//     const recentLeads = respLeads.filter((lead) => {
//       return (
//         (lead.startDate &&
//           new Date(lead.startDate) >= sixtyDaysAgo &&
//           lead.status == "Approved") ||
//         (lead.validTillDate &&
//           new Date(lead.validTillDate) >= sixtyDaysAgo &&
//           lead.status == "Approved")
//       );
//     });

//     if (recentLeads.length === 0) {
//       return res.send(errorRes(404, "No leads found within the last 60 days"));
//     }
//     // const filterLeads=recentLeads.filter(lead.phoneNumber,lead.startDate ,lead.validTill, lead.status);

//     const savedLeads = [];
//     for (const lead of filterLeads) {
//       // You can modify this part based on whether you're creating new leads or updating them
//       const newLead = new leadModel({
//         phoneNumber: lead.phoneNumber,
//         altPhoneNumber: lead.altPhoneNumber,
//         startDate: lead.startDate,
//         validTillDate: lead.validTillDate,
//         status: lead.status,
//       });

//       const savedLead = await newLead.save();
//       savedLeads.push(savedLead);
//     }
//     return res.send(
//       successRes(200, "Leads within 60 days saved to database", {
//         data: savedLeads,
//       })
//     );
//   } catch (error) {
//     next(error); // Pass the error to the error handler middleware
//   }
// };
