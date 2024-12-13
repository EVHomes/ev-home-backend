import clientModel from "../model/client.model.js";
import leadModel from "../model/lead.model.js";
import meetingModel from "../model/meetingSummary.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getMeetingSummary = async (req, res) => {
  try {
    const respMe = await meetingModel.find().populate({
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
            select: "firstName lastName",
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
      successRes(200, "Get Meeting Summary", {
        data: respMe,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const getClientMeetingById= async(req,res)=>{
  try{
    const id=req.params.id;
    if(!id) return res.send(errorRes(401,"ID is required"));
    let query = req.query.query || "";

    let searchFilter = {
  
         $or: [
           { purpose: new RegExp(query, "i") },
         
         ]
         .filter(Boolean),
         customer: id,
       };

    const respMe = await meetingModel.find(searchFilter).populate({
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
            select: "firstName lastName",
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
      return res.send(successRes(200,"get meeting scheduled by client id", {
        data:respMe,
      }))

  }catch (error) {
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
    // console.log("pass1");
    // Check for required fields
    if (!date || !project || !purpose) {
      return res.send(errorRes(403, "All fields are required"));
    }
    const leadResp = await leadModel.findById(lead);
    // console.log("passed note 1 ");

    if (!leadResp) {
      return res.send(errorRes("Meeting scheduled"));
    }
    // console.log("passed note 2 ");
console.log(leadResp);
    const customerResp = await clientModel.findOne({
      phoneNumber: leadResp.phoneNumber,
    });

    if (!customerResp) {  
      return res.send(errorRes("Customer not registered with us yet"));
    }
    // console.log("passed note 3 ");

    const newMeeting = await meetingModel.create({
      ...body,
      customer: customerResp._id
    });
    const respPayment = await meetingModel
      .findById(newMeeting._id)
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
            select: "firstName lastName",
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
