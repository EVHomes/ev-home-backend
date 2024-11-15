import siteVisitModel from "../model/siteVisitForm.model.js";
import { errorRes, successRes } from "../model/response.js";
import axios from "axios";
import employeeModel from "../model/employee.model.js";
import otpModel from "../model/otp.model.js";
import { generateOTP } from "../utils/helper.js";

export const getSiteVisits = async (req, res) => {
  try {
    const respSite = await siteVisitModel
      .find()
      .populate({
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
      })
      .populate({
        path: "attendedBy",
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
      })
      .populate({
        path: "dataEntryBy",
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
      })
      .populate({
        path: "closingTeam",
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
      })
      .populate({
        path: "teamLeaderTeam",
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
      });

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
      .populate({
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
      })
      .populate({
        path: "attendedBy",
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
      })
      .populate({
        path: "dataEntryBy",
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
      })
      .populate({
        path: "closingTeam",
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
      })
      .populate({
        path: "teamLeaderTeam",
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
      });
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
        { email: { $regex: query, $options: "i" } },
        { source: { $regex: query, $options: "i" } },
        // { closingManager: { $regex: query, $options: "i" } },
        // { teamLeader: { $regex: query, $options: "i" } },
      ].filter(Boolean), // Remove any null values
    };
    //     const queryParts = query.split(" ").filter(Boolean);

    // let searchFilter = {
    //   $or: [
    //     ...queryParts.map(part => ({
    //       $or: [
    //         { firstName: { $regex: part, $options: "i" } },
    //         { lastName: { $regex: part, $options: "i" } }
    //       ]
    //     })),
    //     isNumberQuery ? { $expr: { $regexMatch: { input: { $toString: "$phoneNumber" }, regex: query } } } : null,
    //     { email: { $regex: query, $options: "i" } },
    //     { source: { $regex: query, $options: "i" } },
    //     // { closingManager: { $regex: query, $options: "i" } },
    //     // { teamLeader: { $regex: query, $options: "i" } },
    //   ].filter(Boolean), // Remove any null values
    // };

    // Perform the search with pagination
    const respSite = await siteVisitModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 })
      .populate({
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
      })
      .populate({
        path: "attendedBy",
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
      })
      .populate({
        path: "dataEntryBy",
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
      })
      .populate({
        path: "closingTeam",
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
      })
      .populate({
        path: "teamLeaderTeam",
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
      });

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

export const addSiteVisits = async (req, res) => {
  const body = req.body;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    residence,
    address,
    projects,
    choiceApt,
    source,
    closingManager,
    closingTeam,
    teamLeader,
    team,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    // if (!residence) return res.send(errorRes(403, "Residence is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!projects) return res.send(errorRes(403, "Project is required"));
    if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));
    if (!closingManager) res.send(errorRes(403, "Closing Manager is required"));
    // if(!closingTeam) res.send(errorRes(403,"Closing Team is required"));
    if (!choiceApt) return res.send(errorRes(403, "Choice of Apartment is required"));

    // console.log(body);
    const newSiteVisit = await siteVisitModel.create({
      ...body,
    });
    await newSiteVisit.save();

    //  if (!id) return res.send(errorRes(403, "id is required"));
    const populateNewSiteVisit = await siteVisitModel
      .findById(newSiteVisit._id)
      .populate({
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
      })
      .populate({
        path: "attendedBy",
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
      })
      .populate({
        path: "dataEntryBy",
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
      })
      .populate({
        path: "closingTeam",
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
      })
      .populate({
        path: "teamLeaderTeam",
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
      });
    // console.log(body);
    return res.send(
      successRes(200, `Client added successfully: ${firstName} ${lastName}`, {
        data: populateNewSiteVisit,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const generateSiteVisitOtp = async (req, res, next) => {
  const { project, firstName, lastName, phoneNumber, closingManager, email } = req.body;
  let url;
  try {
    const user = await employeeModel.findById(closingManager);
    const findOldOtp = await otpModel.findOne({
      $or: [{ phoneNumber: phoneNumber }, { email: email }],
    });
    if (findOldOtp) {
      if (project?.toLowerCase() === "10 marina bay".toLowerCase()) {
        url = `https://hooks.zapier.com/hooks/catch/9993809/2r64nmh?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${findOldOtp.otp}`;
      } else {
        url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${findOldOtp.otp}`;
      }
      const resp = await axios.post(url);
      console.log(resp);
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
    if (project?.toLowerCase() === "10 Marina Bay") {
      url = `https://hooks.zapier.com/hooks/catch/9993809/2r64nmh?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${newOtp}`;
    } else {
      url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${newOtp}`;
    }

    // let url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${newOtp}`;
    // console.log(encodeURIComponent(url));
    const resp = await axios.post(url);
    console.log(resp);

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

    if (otp != otpExist.otp) return res.send(errorRes(401, "Otp Didn't matched"));

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
      team,
    } = body;

    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!residence) return res.send(errorRes(403, "Residence is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!projects) return res.send(errorRes(403, "Project is required"));
    if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));
    if (!source) return res.send(errorRes(403, "Source is required"));
    if (!closingManager) return res.send(errorRes(403, "Closing Manager is required"));
    if (!closingTeam) return res.send(errorRes(403, "Closing Team is required"));
    if (!choiceApt) return res.send(errorRes(403, "Choice of Apartment is required"));
    if (!teamLeader) return res.send(errorRes(403, "Team Leader is required"));
    if (!team) return res.send(errorRes(403, "Team is required"));

    const updatedSite = await siteVisitModel
      .findByIdAndUpdate(
        id,
        {
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
          team,
        },
        { new: true }
      )
      .populate({
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
      });

    if (!updatedSite) return res.send(errorRes(404, `Site not found with ID: ${id}`));

    return res.send(
      successRes(200, `Site updated successfully: ${firstName} ${lastName}`, {
        updatedSite,
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

    if (!deletedSite) return res.send(errorRes(404, `Site not found with ID: ${id}`));

    return res.send(
      successRes(200, `Site deleted successfully with ID: ${id}`, {
        deletedSite,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};
