import leadModel, { leadSchema } from "../model/lead.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getAllLeads = async (req, res, next) => {
  try {
    const respLeads = await leadModel.find();

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

export const getLeadById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respLead = await leadModel
      .findById({ _id: id })
      .populate({
        path: "project",
        select: "",
      })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "teamLeader",
        select: "-password -refreshToken",
      })
      .populate({
        path: "dataAnalyser",
        select: "-password -refreshToken",
      })
      .populate({
        path: "preSalesExecutive",
        select: "-password -refreshToken",
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
    dataAnalyser,
    channelPartner,
    teamLeader,
    preSalesExecutive,
    status,
    project,
    interestedStatus,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
    if (!dataAnalyser)
      return res.send(errorRes(403, "Data analyzer is required"));
    if (!channelPartner)
      return res.send(errorRes(403, "Channel partner is required"));
    if (!teamLeader) return res.send(errorRes(403, "Team leader is required"));
    if (!status) return res.send(errorRes(403, "Status is required"));
    if (!interestedStatus)
      return res.send(errorRes(403, "Interested status is required"));
    //if(!preSalesExecutive) return res.send(errorRes(403,"Pre sales executive is required"));
    if (!remark) return res.send(errorRes(403, "Remark is required"));
    if (!project) return res.send(errorRes(403, "Project is required"));

    // Create a new lead object
    const newLead = await leadModel.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      altPhoneNumber,
      remark,
      dataAnalyser: "6703dd099f4039f877e104f9",
      teamLeader: "6703dd099f4039f877e104f9",
      preSalesExecutive: "6703dd099f4039f877e104f9",
      channelPartner: "6703954f719e24844ec82e60",
      status,
      interestedStatus,
      project: "6704efc3bca837e200d0abee",
      startDate: startDate || Date.now(), // Use current date if not provided
      validTill: new Date(
        new Date(startDate || Date.now()).setMonth(new Date().getMonth() + 2)
      ), // Valid for 2 months
      // Additional optional fields can be added here (like address, status, etc.)
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
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
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
    if (!updatedLead)
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));

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
    if (!deletedLead)
      return res.send(errorRes(404, `Lead not found with ID: ${id}`));

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
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone Number is required"));

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
          `Lead already exists with phone number: ${
            (phoneNumber, altPhoneNumber)
          }`
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
