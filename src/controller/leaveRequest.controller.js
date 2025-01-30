import leaveRequestModel from "../model/leaveRequest.model.js";
import employeeModel from "../model/employee.model.js";
import { errorRes, successRes } from "../model/response.js";

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

export const addLeave = async (req, res, next) => {
  const {
    leaveType,
    appliedOn,
    startDate,
    endDate,
    numberOfDays,
    reason,
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
    if (!reason)
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
      leaveType,
      appliedOn,
      startDate,
      endDate,
      numberOfDays,
      reason,
      approveReason: approveReason || "pending",
      leaveStatus: leaveStatus || "pending",
      applicant: applybyEmployee._id,
      reportingTo: reportingToEmployee._id,
      attachedFile,
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

    return res.status(200).send({
      success: true,
      message: "Leave Status updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error updating Leave Status :", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
