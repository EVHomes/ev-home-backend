import { errorRes, successRes } from "../model/response.js";
import feedbackEnquiryModel from "../model/feedbackEnquiry.model.js";
import employeeModel from "../model/employee.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import leadModel from "../model/lead.model.js";
import { sendNotificationWithImage } from "./oneSignal.controller.js";
import { leadPopulateOptions } from "../utils/constant.js";


export const getFeedbackEnquiry = async (req, res) => {
  try {
    const respPro = await feedbackEnquiryModel.find().populate({path:"channelPartner",select:"firmName"});
    return res.send(
      successRes(200, "Get enquiry form details", {
        data: respPro,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};


export const getFeedbackEnquiryById = async (req, res) => {
    try {
      const respPro = await feedbackEnquiryModel.find();
      return res.send(
        successRes(200, "Get enquiry form details", {
          data: respPro,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, `Server error: ${error?.message}`));
    }
  };

export const addFeedbackEnquiry = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const { enquiryabout, message,} = body;

  try {

    if (!body) return res.send(errorRes(403, "Body is required"));


    const leadResp = await leadModel.findById(id).populate(leadPopulateOptions);
    const channelPartner = leadResp.channelPartner;

    if (!channelPartner) {
        return res.send(errorRes("Channel Partner ID not found for the given lead."));
      }
  
      console.log("Channel Partner ID:", channelPartner);
      
    if (!leadResp) {
      return res.send(errorRes("Info not found for notification"));
    }

    const teams = await employeeModel.find({ reportingTo: id }).select("_id");
    const ids = teams.map((ele) => ele._id);

    const newEnquiry = await feedbackEnquiryModel.create({channelPartner ,enquiryabout:message,  ...body});
    await newEnquiry.save();

    console.log("Team members IDs:", ids);

    const foundPlayerIds = await oneSignalModel.find({
      docId: { $in: [leadResp.dataAnalyzer, leadResp.teamLeader, ...ids] }, // Spread team IDs into array
    });

    console.log("Found Player IDs:", foundPlayerIds);

    if (foundPlayerIds.length > 0) {
      const getPlayerIds = foundPlayerIds.map((dt) => dt.playerId);

      await sendNotificationWithImage({
        playerIds: getPlayerIds,
        title: "Notification from Channel Partner",
        imageUrl: "",
        message: message,
      });

      console.log("Notification sent successfully.");
    }

    return res.send(
      successRes(200, `Enquiry added successfully and notification sent.`, {
        data: newEnquiry,
      })
    );
  } catch (error) {
    console.error("Error adding enquiry or sending notification:", error);
    return res.send(errorRes(500, error));
  }
};
