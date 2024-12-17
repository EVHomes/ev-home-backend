import siteVisitModel from "../model/siteVisit.model.js";
import { errorRes, successRes } from "../model/response.js";
import axios from "axios";
import employeeModel from "../model/employee.model.js";
import otpModel from "../model/otp.model.js";
import { encryptPassword, generateOTP } from "../utils/helper.js";
import leadModel from "../model/lead.model.js";
import { sendNotificationWithImage } from "./oneSignal.controller.js";
import oneSignalModel from "../model/oneSignal.model.js";
import clientModel from "../model/client.model.js";
import { siteVisitPopulateOptions } from "../utils/constant.js";
Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export const getSiteVisits = async (req, res) => {
  try {
    const respSite = await siteVisitModel
      .find()
      .populate(siteVisitPopulateOptions);

    return res.send(
      successRes(200, "Get Site Visit", {
        data: respSite,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

export const getSiteVisitsById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    const respSite = await siteVisitModel
      .findById(id)
      .populate(siteVisitPopulateOptions);

    if (!respSite)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
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

export const searchSiteVisits = async (req, res, next) => {
  try {
    let query = req.query.query || "";
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;

    const isNumberQuery = !isNaN(query);
    let visitType = null;
    let status = req.query.status?.toLowerCase();

    if (status == "visit") {
      visitType = { visitType: "visit" };
    } else if (status == "revisit") {
      visitType = { visitType: "revisit" };
    } else if (status == "virtual-meeting") {
      visitType = { visitType: "virtual-meeting" };
    }
    let searchFilter = {
      ...(visitType != null ? visitType : null),

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
        { email: { $regex: query, $options: "i" } },
        { source: { $regex: query, $options: "i" } },
        // { closingManager: { $regex: query, $options: "i" } },
        // { teamLeader: { $regex: query, $options: "i" } },
      ].filter(Boolean), // Remove any null values
    };

    // Perform the search with pagination
    const respSite = await siteVisitModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })
      .populate(siteVisitPopulateOptions);

    // Count the total items matching the filter
    const totalItems = await siteVisitModel.countDocuments(searchFilter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get site visits", {
        page,
        limit,
        totalPages,
        totalItems,
        data: respSite,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getClosingManagerSiteVisitById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.send(errorRes(401, "Id required"));

    let query = req.query.query || "";
    let page = parseInt(req.query.page) || 1; // Start from page 1
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    const isNumberQuery = !isNaN(query);

    let visitType = null;
    let status = req.query.status?.toLowerCase();

    if (status == "visit") {
      visitType = { visitType: "visit" };
    } else if (status == "revisit") {
      visitType = { visitType: "revisit" };
    } else if (status == "virtual-meeting") {
      visitType = { visitType: "virtual-meeting" };
    } else if (status == "walk-in") {
      visitType = { source: "Walk-in" };
    }

    let searchFilter = {
      ...(visitType != null ? visitType : null),
      closingManager: { $eq: id },
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
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
      ].filter(Boolean),
    };
    const resp = await siteVisitModel
      .find(searchFilter)
      .sort({ date: -1 })

      .skip(skip)
      .limit(limit)
      .populate(siteVisitPopulateOptions);

    // Count the total items matching the filter
    const totalItems = await siteVisitModel.countDocuments(searchFilter); // Count with the same filter
    // const registrationDone = await siteVisitModel.countDocuments({
    //   bookingStatus: "Registration Done",
    // });
    // const eoiRecieved = await postSaleLeadModel.countDocuments({
    //   bookingStatus: "EOI Recieved",
    // });
    // const cancelled = await postSaleLeadModel.countDocuments({
    //   bookingStatus: "Cancelled",
    // });
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get site visit leads", {
        page,
        limit,
        totalItems,
        totalPages,
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const addSiteVisits = async (req, res) => {
  const body = req.body;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    residence,
    projects,
    choiceApt,
    source,
    closingManager,
    closingTeam,
    teamLeader,
    lead,
    visitType,
    virtualMeetingDoc,
    location,
  } = body;
  // console.log(body);
  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    // if (!residence) return res.send(errorRes(403, "Residence is required"));
    if (!projects) return res.send(errorRes(403, "Project is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
    if (!closingManager) res.send(errorRes(403, "Closing Manager is required"));
    // if(!closingTeam) res.send(errorRes(403,"Closing Team is required"));
    if (!choiceApt)
      return res.send(errorRes(403, "Choice of Apartment is required"));

    // console.log(body.date);
    // console.log(new Date().toISOString());
    // body.date = null;
    const newSiteVisit = await siteVisitModel.create({
      ...body,
      // date: new Date(),
      virtualMeetingDoc: virtualMeetingDoc,
    });

    await newSiteVisit.save();

    const hashPassword = await encryptPassword(phoneNumber.toString());
    const newClient = await clientModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      projects: location,
      address: residence,
      closingManager,
      choiceApt,
      password: hashPassword,
    });
    await newClient.save();
    //  if (!id) return res.send(errorRes(403, "id is required"));
    const populateNewSiteVisit = await siteVisitModel
      .findById(newSiteVisit?._id)
      .populate(siteVisitPopulateOptions);

    if (lead != null) {
      const foundLead = await leadModel.findById(lead);

      if (foundLead) {
        // return res.send(errorRes(404, "no lead found with id"));
        // if (visitType === "booked") {
        //   foundLead.bookingStatus = "booked";
        //   foundLead.bookingRef = bookingRef;
        //   await foundLead.save();
        // }

        if (visitType === "visited") {
          foundLead.visitStatus = "visited";
          foundLead.stage = "revisit";
          foundLead.visitRef = populateNewSiteVisit._id;
          foundLead.cycle.stage = "revisit";
          foundLead.cycle.validTill = new Date().addDays(30);
          await foundLead.save();
        }

        if (visitType === "virtual-meeting") {
          foundLead.visitStatus = "virtual-meeting";
          foundLead.stage = "revisit";
          foundLead.visitRef = populateNewSiteVisit._id;
          foundLead.cycle.stage = "revisit";
          foundLead.cycle.validTill = new Date().addDays(30);
          foundLead.virtualMeetingDoc = virtualMeetingDoc;

          await foundLead.save();
        }

        if (visitType === "revisited") {
          foundLead.revisitStatus = "revisited";
          foundLead.stage = "booking";
          foundLead.revisitRef = populateNewSiteVisit._id;
          foundLead.cycle.validTill = new Date().addDays(180);

          await foundLead.save();
        }
        if (visitType === "called") {
          foundLead.contactedStatus = "contacted";
          // foundLead.revisitRef = populateNewSiteVisit._id;
          await foundLead.save();
        }
      }
    } else {
      const foundLead = await leadModel.findOne({
        phoneNumber: phoneNumber,
        approvalStatus: { $ne: "pending" },
      });
      if (foundLead) {
        if (visitType === "visited") {
          foundLead.visitStatus = "visited";
          foundLead.stage = "revisit";
          foundLead.visitRef = populateNewSiteVisit._id;
          foundLead.cycle.stage = "revisit";
          foundLead.cycle.validTill = new Date().addDays(30);

          await foundLead.save();
        }

        if (visitType === "virtual-meeting") {
          foundLead.visitStatus = "virtual-meeting";
          foundLead.stage = "revisit";
          foundLead.visitRef = populateNewSiteVisit._id;
          foundLead.cycle.stage = "revisit";
          foundLead.cycle.validTill = new Date().addDays(30);
          foundLead.virtualMeetingDoc = virtualMeetingDoc;

          await foundLead.save();
        }

        if (visitType === "revisited") {
          foundLead.revisitStatus = "revisited";
          foundLead.stage = "booking";
          foundLead.revisitRef = populateNewSiteVisit._id;
          foundLead.cycle.validTill = new Date().addMonths(5);

          await foundLead.save();
        }
        if (visitType === "called") {
          foundLead.contactedStatus = "contacted";
          // foundLead.revisitRef = revisitRef;
          await foundLead.save();
        }
      }
    }
    const startDate = new Date();
    const validTill = new Date(startDate);
    const validTillbefore = new Date(startDate);

    validTillbefore.setDate(validTillbefore.getDate() + 15);
    validTill.setDate(validTill.getDate() + 30);

    if (source?.toLowerCase() === "walk-in") {
      await leadModel.create({
        leadType: source?.toLowerCase(),
        firstName: firstName,
        address: residence,
        email: email,
        lastName: lastName,
        project: projects,
        requirement: choiceApt,
        phoneNumber: phoneNumber,
        teamLeader: closingManager,
        visitRef: newSiteVisit?._id,
        visitStatus: visitType,
        stage: "revisit",
        cycle: {
          nextTeamLeader: null,
          stage: "revisit",
          currentOrder: 1,
          teamLeader: closingManager,
          startDate: startDate,
          validTill: validTill,
        },
        cycleHistory: [
          {
            nextTeamLeader: null,
            stage: "visit",
            currentOrder: 1,
            teamLeader: closingManager,
            startDate: startDate,
            validTill: validTillbefore,
          },
        ],
      });
      const foundTLPlayerId = await oneSignalModel.findOne({
        docId: closingManager,
        // role: teamLeaderResp?.role,
      });

      if (foundTLPlayerId) {
        // console.log(foundTLPlayerId);

        await sendNotificationWithImage({
          playerIds: [foundTLPlayerId.playerId],
          title: "You've Got a new walk-in Lead!",
          message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
          imageUrl:
            "https://img.freepik.com/premium-vector/checklist-with-check-marks-pencil-envelope-list-notepad_1280751-82597.jpg?w=740",
        });
        // console.log("pass sent notification");
      }
    }

    return res.send(
      successRes(200, `Client added successfully: ${firstName} ${lastName}`, {
        data: populateNewSiteVisit,
      })
    );
  } catch (error) {
    // console.log(error);
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const generateSiteVisitOtp = async (req, res, next) => {
  const {
    project,
    firstName,
    lastName,
    phoneNumber,
    closingManager,
    email,
    lead,
  } = req.body;
  let url;
  try {
    const user = await employeeModel.findById(closingManager);
    const findOldOtp = await otpModel.findOne({
      $or: [{ phoneNumber: phoneNumber }, { email: email }],
    });
    if (findOldOtp) {
      if (
        project?.toLowerCase() === "project-ev-10-marina-bay-vashi-sector-10"
      ) {
        url = `https://hooks.zapier.com/hooks/catch/9993809/2r64nmh?phoneNumber=${encodeURIComponent(
          `+91${phoneNumber}`
        )}&name=${firstName} ${lastName}&project=${project}&closingManager=${
          user?.firstName
        } ${user?.lastName}&otp=${findOldOtp.otp}`;
      } else {
        url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=${encodeURIComponent(
          `+91${phoneNumber}`
        )}&name=${firstName} ${lastName}&project=${project}&closingManager=${
          user?.firstName
        } ${user?.lastName}&otp=${findOldOtp.otp}`;
      }
      const resp = await axios.post(url);
      // console.log(resp);
      return res.send(
        successRes(200, "otp Sent to Client", {
          data: findOldOtp,
        })
      );
    }

    const newOtp = generateOTP(6);
    const newOtpModel = new otpModel({
      otp: newOtp,
      docId: user?._id,
      email: email ?? "noemailprovided2026625@gmail.com",
      phoneNumber: phoneNumber,
      type: "site-visit-entry",
      message: "Site Visit Verification Code",
    });

    const savedOtp = await newOtpModel.save();
    if (project?.toLowerCase() === "project-ev-10-marina-bay-vashi-sector-10") {
      url = `https://hooks.zapier.com/hooks/catch/9993809/2r64nmh?phoneNumber=${encodeURIComponent(
        `+91${phoneNumber}`
      )}&name=${firstName} ${lastName}&project=${project}&closingManager=${
        user?.firstName
      } ${user?.lastName}&otp=${newOtp}`;
    } else {
      url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=${encodeURIComponent(
        `+91${phoneNumber}`
      )}&name=${firstName} ${lastName}&project=${project}&closingManager=${
        user?.firstName
      } ${user?.lastName}&otp=${newOtp}`;
    }

    // let url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${newOtp}`;
    // console.log(encodeURIComponent(url));
    const resp = await axios.post(url);
    // console.log(resp);

    return res.send(
      successRes(200, "otp Sent to Client", {
        data: savedOtp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const verifySiteVisitOtp = async (req, res, next) => {
  const { phoneNumber, otp, email } = req.body;
  try {
    if (!otp) return res.send(errorRes(401, "Invalid Otp"));

    const otpExist = await otpModel.findOne({
      $or: [{ phoneNumber: phoneNumber }, { email: email }],
    });

    if (!otpExist) return res.send(errorRes(404, "Otp is Expired"));

    if (otp != otpExist.otp)
      return res.send(errorRes(401, "Otp Didn't matched"));

    await otpExist.deleteOne();

    return res.send(
      successRes(200, "otp Verified Successfully", {
        data: true,
      })
    );
  } catch (error) {
    return next(error);
  }
};
export const updateSiteVisits = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!body) return res.send(errorRes(403, "Data is required"));

    if (!body) return res.send(errorRes(403, "Data is required"));

    const updatedSite = await siteVisitModel
      .findByIdAndUpdate(
        id,
        {
          ...body,
        },
        { new: true }
      )
      .populate(siteVisitPopulateOptions);

    if (!updatedSite)
      return res.send(errorRes(404, `Site not found with ID: ${id}`));

    return res.send(
      successRes(200, `Site Visit updated successfully`, {
        data: updatedSite,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const deleteSiteVisits = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));

    const deletedSite = await siteVisitModel.findByIdAndDelete(id);

    if (!deletedSite)
      return res.send(errorRes(404, `Site not found with ID: ${id}`));

    return res.send(
      successRes(200, `Site deleted successfully with ID: ${id}`, {
        data: deletedSite,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const addSiteVisitsManual = async (data) => {
  const body = data;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    residence,
    projects,
    choiceApt,
    source,
    closingManager,
    closingTeam,
    teamLeader,
    lead,
    visitType,
    virtualMeetingDoc,
    location,
  } = body;

  try {
    console.log("pass 1");
    const newSiteVisit = await siteVisitModel.create({
      ...body,
    });

    await newSiteVisit.save();

    const hashPassword = await encryptPassword(phoneNumber.toString());
    const newClient = await clientModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      projects: location,
      address: residence,
      closingManager,
      choiceApt,
      password: hashPassword,
    });
    await newClient.save();
    //  if (!id) return res.send(errorRes(403, "id is required"));
    const populateNewSiteVisit = await siteVisitModel
      .findById(newSiteVisit?._id)
      .populate(siteVisitPopulateOptions);

    // if (lead != null) {
    //   const foundLead = await leadModel.findById(lead);

    //   if (foundLead) {
    //     // return res.send(errorRes(404, "no lead found with id"));
    //     // if (visitType === "booked") {
    //     //   foundLead.bookingStatus = "booked";
    //     //   foundLead.bookingRef = bookingRef;
    //     //   await foundLead.save();
    //     // }

    //     if (visitType === "visited") {
    //       foundLead.visitStatus = "visited";
    //       foundLead.stage = "revisit";
    //       foundLead.visitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.stage = "revisit";
    //       foundLead.cycle.validTill = new Date().addDays(30);
    //       await foundLead.save();
    //     }

    //     if (visitType === "virtual-meeting") {
    //       foundLead.visitStatus = "virtual-meeting";
    //       foundLead.stage = "revisit";
    //       foundLead.visitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.stage = "revisit";
    //       foundLead.cycle.validTill = new Date().addDays(30);
    //       foundLead.virtualMeetingDoc = virtualMeetingDoc;

    //       await foundLead.save();
    //     }

    //     if (visitType === "revisited") {
    //       foundLead.revisitStatus = "revisited";
    //       foundLead.stage = "booking";
    //       foundLead.revisitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.validTill = new Date().addDays(180);

    //       await foundLead.save();
    //     }
    //     if (visitType === "called") {
    //       foundLead.contactedStatus = "contacted";
    //       // foundLead.revisitRef = populateNewSiteVisit._id;
    //       await foundLead.save();
    //     }
    //   }
    // } else {
    //   const foundLead = await leadModel.findOne({
    //     phoneNumber: phoneNumber,
    //     approvalStatus: { $ne: "pending" },
    //   });
    //   if (foundLead) {
    //     if (visitType === "visited") {
    //       foundLead.visitStatus = "visited";
    //       foundLead.stage = "revisit";
    //       foundLead.visitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.stage = "revisit";
    //       foundLead.cycle.validTill = new Date().addDays(30);

    //       await foundLead.save();
    //     }

    //     if (visitType === "virtual-meeting") {
    //       foundLead.visitStatus = "virtual-meeting";
    //       foundLead.stage = "revisit";
    //       foundLead.visitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.stage = "revisit";
    //       foundLead.cycle.validTill = new Date().addDays(30);
    //       foundLead.virtualMeetingDoc = virtualMeetingDoc;

    //       await foundLead.save();
    //     }

    //     if (visitType === "revisited") {
    //       foundLead.revisitStatus = "revisited";
    //       foundLead.stage = "booking";
    //       foundLead.revisitRef = populateNewSiteVisit._id;
    //       foundLead.cycle.validTill = new Date().addMonths(5);

    //       await foundLead.save();
    //     }
    //     if (visitType === "called") {
    //       foundLead.contactedStatus = "contacted";
    //       // foundLead.revisitRef = revisitRef;
    //       await foundLead.save();
    //     }
    //   }
    // }
    const startDate = new Date(body.date);
    const validTill = new Date(startDate);
    const validTillbefore = new Date(startDate);

    validTillbefore.setDate(validTillbefore.getDate() + 15);
    validTill.setDate(validTill.getDate() + 30);

    // if (source?.toLowerCase() === "walk-in") {
    //   await leadModel.create({
    //     leadType: source?.toLowerCase(),
    //     firstName: firstName,
    //     address: residence,
    //     email: email,
    //     lastName: lastName,
    //     project: projects,
    //     requirement: choiceApt,
    //     phoneNumber: phoneNumber,
    //     teamLeader: closingManager,
    //     visitRef: newSiteVisit?._id,
    //     visitStatus: visitType,
    //     stage: "revisit",
    //     cycle: {
    //       nextTeamLeader: null,
    //       stage: "revisit",
    //       currentOrder: 1,
    //       teamLeader: closingManager,
    //       startDate: startDate,
    //       validTill: validTill,
    //     },
    //     cycleHistory: [
    //       {
    //         nextTeamLeader: null,
    //         stage: "visit",
    //         currentOrder: 1,
    //         teamLeader: closingManager,
    //         startDate: startDate,
    //         validTill: validTillbefore,
    //       },
    //     ],
    //   });
    //   const foundTLPlayerId = await oneSignalModel.findOne({
    //     docId: closingManager,
    //     // role: teamLeaderResp?.role,
    //   });

    //   if (foundTLPlayerId) {
    //     // console.log(foundTLPlayerId);

    //     await sendNotificationWithImage({
    //       playerIds: [foundTLPlayerId.playerId],
    //       title: "You've Got a new walk-in Lead!",
    //       message: `A new lead has been assigned to you. Check the details and make contact to move things forward.`,
    //       imageUrl:
    //         "https://img.freepik.com/premium-vector/checklist-with-check-marks-pencil-envelope-list-notepad_1280751-82597.jpg?w=740",
    //     });
    //     // console.log("pass sent notification");
    //   }
    // }

    return "ok";
  } catch (error) {
    console.log(error);
    return error;
  }
};
