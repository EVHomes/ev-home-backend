import express from "express";
import attendanceModel from "../../model/attendance.model.js";
import { errorRes, successRes } from "../../model/response.js";

const attendanceRouter = express.Router();

// Utility function to calculate total seconds between two dates
const calculateSeconds = (start, end) => {
  return Math.floor((new Date(end) - new Date(start)) / 1000);
};

// Check-In Endpoint
attendanceRouter.post("/check-in", async (req, res) => {
  try {
    const { userId, checkInLatitude, checkInLongitude, checkInPhoto } =
      req.body;

    // Validate required fields
    if (!userId || !checkInLatitude || !checkInLongitude || !checkInPhoto) {
      return res.send(errorRes(400, "Missing required fields"));
    }

    const now = new Date();
    const existingAttendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (existingAttendance) {
      return res.send(
        successRes(400, "User has already checked in today", {
          data: existingAttendance,
        })
      );
    }

    const newAttendance = new attendanceModel({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      checkInTime: now,
      checkInLatitude,
      checkInLongitude,
      checkInPhoto,
      status: "present",
    });

    await newAttendance.save();
    return res.send(
      successRes(200, "Check-in successful", { data: newAttendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Break Start Endpoint
attendanceRouter.post("/break-start", async (req, res) => {
  try {
    const { userId } = req.body;

    const now = new Date();
    const attendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!attendance) {
      return res.send(errorRes(404, "Attendance record not found for today"));
    }

    if (attendance.breakStartTime) {
      return res.send(errorRes(400, "Break already started"));
    }

    attendance.breakStartTime = now;
    await attendance.save();

    return res.send(
      successRes(200, "Break started successfully", { data: attendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Break End Endpoint
attendanceRouter.post("/break-end", async (req, res) => {
  try {
    const { userId } = req.body;

    const now = new Date();
    const attendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!attendance || !attendance.breakStartTime) {
      return res.send(errorRes(400, "No active break to end"));
    }

    const breakDuration = calculateSeconds(attendance.breakStartTime, now);
    attendance.totalBreakSeconds += breakDuration;
    attendance.breakStartTime = null;
    await attendance.save();

    return res.send(
      successRes(200, "Break ended successfully", { data: attendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Check-Out Endpoint
attendanceRouter.post("/check-out", async (req, res) => {
  try {
    const { userId, checkOutLatitude, checkOutLongitude, checkOutPhoto } =
      req.body;

    const now = new Date();
    const attendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!attendance) {
      return res.send(errorRes(404, "Attendance record not found for today"));
    }

    if (attendance.checkOutTime) {
      return res.send(errorRes(400, "User has already checked out"));
    }

    const activeDuration =
      calculateSeconds(attendance.checkInTime, now) -
      attendance.totalBreakSeconds;
    attendance.checkOutTime = now;
    attendance.checkOutLatitude = checkOutLatitude;
    attendance.checkOutLongitude = checkOutLongitude;
    attendance.checkOutPhoto = checkOutPhoto;
    attendance.totalActiveSeconds = activeDuration;
    attendance.status = "completed";
    await attendance.save();
    return res.send(
      successRes(200, "Check-out successful", { data: attendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Manual Entry Endpoint
attendanceRouter.post("/manual-entry", async (req, res) => {
  try {
    const { userId, startTime, endTime, remarks } = req.body;

    if (!userId || !startTime || !endTime || !remarks) {
      return res.send(errorRes(400, "Missing required fields"));
    }

    const now = new Date();
    const attendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!attendance) {
      return res.send(errorRes(404, "Attendance record not found for today"));
    }

    const manualDuration = calculateSeconds(startTime, endTime);
    attendance.totalActiveSeconds += manualDuration;

    attendance.timeline = attendance.timeline || [];
    attendance.timeline.push({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      remarks,
    });

    await attendance.save();
    return res.send(
      successRes(200, "Manual entry added successfully", { data: attendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

attendanceRouter.post("/update-timeline", async (req, res) => {
  try {
    const { userId, startTime, endTime, remarks } = req.body;

    if (!userId || !startTime || !endTime || !remarks) {
      return res.send(errorRes(400, "Missing required fields"));
    }

    const now = new Date();
    const attendance = await attendanceModel.findOne({
      userId,
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    if (!attendance) {
      return res.send(errorRes(404, "Attendance record not found for today"));
    }

    // Add inactive period to timeline
    attendance.timeline = attendance.timeline || [];
    attendance.timeline.push({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      remarks,
    });

    await attendance.save();
    return res.send(
      successRes(200, "Timeline updated successfully", { data: attendance })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

export default attendanceRouter;
