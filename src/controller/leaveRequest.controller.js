import leaveRequestModel from "../model/leaveRequest.model.js";
import employeeModel from "../model/employee.model.js";
import { errorRes, successRes } from "../model/response.js";
import moment from "moment-timezone";
import attendanceModel from "../model/attendance.model.js";
import { leaveRequestPopulateOptions } from "../utils/constant.js";

export const getLeave = async (req, res, next) => {
  const { applicant, reportingTo, leaveStatus } = req.query;
  try {
    const query = {};
    if (applicant) {
      query.applicant = applicant;
    }
    if (reportingTo) {
      query.reportingTo = reportingTo;
    }
    if (leaveStatus) {
      query.leaveStatus = leaveStatus;
    }

    const resp = await leaveRequestModel
      .find(query)
      .populate("applicant", "firstName lastName email")
      .populate("reportingTo", "firstName lastName email");

    if (resp.length === 0) {
      return res.status(404).send(errorRes(404, "No Leave records found"));
    }
    return res
      .status(200)
      .send(successRes(200, "Leave records retrieved", { data: resp }));
  } catch (error) {
    console.error("Error retrieving leave requests:", error);
    return res.status(500).send(errorRes(500, "Internal Server Error"));
  }
};

export const getApplyLeave = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "id is required"));

    const resp = await leaveRequestModel
      .find({ reportingTo: id })
      .populate(leaveRequestPopulateOptions)
      .sort({
        appliedOn: -1,
      });

    return res.send(successRes(200, "Leave records retrieved", { data: resp }));
  } catch (error) {
    console.error("Error retrieving leave requests:", error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const getMyLeave = async (req, res, next) => {
  // const { applicant, reportingTo, leaveStatus } = req.query;
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "id is required"));

    const resp = await leaveRequestModel
      .find({ applicant: id })
      .populate(leaveRequestPopulateOptions)
      .sort({
        appliedOn: -1,
      });

    return res.send(successRes(200, "Leave records retrieved", { data: resp }));
  } catch (error) {
    console.error("Error retrieving leave requests:", error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const addLeave = async (req, res, next) => {
  const {
    leaveType,
    appliedOn,
    startDate,
    endDate,
    numberOfDays,
    leaveReason,
    approveReason,
    leaveStatus,
    reportingTo,
    applicant,
    attachedFile,
  } = req.body;

  try {
    if (!startDate)
      return res.status(401).send(errorRes(401, "Start Date is required"));
    if (!endDate)
      return res.status(401).send(errorRes(401, "End Date is required"));
    if (!leaveReason)
      return res.status(401).send(errorRes(401, "Reason is required"));

    const applybyEmployee = await employeeModel.findById(applicant);

    if (!applybyEmployee)
      return res.status(404).send(errorRes(404, "Apply By employee not found"));

    const reportingToEmployee = await employeeModel.findById(reportingTo);

    if (!reportingToEmployee)
      return res
        .status(404)
        .send(errorRes(404, "Reporting To employee not found"));

    const newLeaveRequest = await leaveRequestModel.create({
      ...req.body,
    });

    return res.status(200).send(
      successRes(200, "Leave Request added", {
        data: newLeaveRequest,
      })
    );
  } catch (error) {
    console.error("Error in addLeave:", error);
    return res.status(500).send(errorRes(500, "Internal Server Error"));
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { leaveStatus, approveReason } = req.body;
  try {
    if (!leaveStatus) {
      return res.status(400).send({
        success: false,
        message: "Leave Status is required",
      });
    }
    const leave = await leaveRequestModel.findById(id);
    if (!leave) {
      return res.status(404).send({
        success: false,
        message: "Leave request not found",
      });
    }
    leave.leaveStatus = leaveStatus;
    leave.approveReason = approveReason || "No reason provided";

    await leave.save();
    if (leaveStatus?.toLowerCase() === "approved") {
      const dates = [];
      let currentDate = moment(leave.startDate);

      while (currentDate <= moment(leave.endDate)) {
        dates.push({
          day: currentDate.date(),
          month: currentDate.month() + 1, // Moment months are 0-based, so we add 1
          year: currentDate.year(),
          status: "on-leave",
          wlStatus: "on-leave",
          userId: leave.applicant,
        });
        currentDate.add(1, "days");
      }
      console.log(dates);
      try {
        await attendanceModel.insertMany(dates, { ordered: false });
      } catch (error) {
        if (error.writeErrors) {
          console.log("Some entries were skipped due to duplicates.");
        } else {
          console.error("Failed to insert leaves:", error);
        }
        // console.log("failed to insert leaves");
      }
    }

    return res
      .status(200)
      .send(
        successRes(200, "Leave Status updated successfully", { data: leave })
      );
  } catch (error) {
    console.error("Error updating Leave Status :", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
