import express from "express";
import attendanceModel from "../../model/attendance.model.js";
import { errorRes, successRes } from "../../model/response.js";
import { attendancePopulateOption } from "../../utils/constant.js";
import XLSX from "xlsx";
import moment from "moment-timezone";

import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import employeeModel from "../../model/employee.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      if (
        !existingAttendance.checkInTime ||
        !existingAttendance.checkInLatitude ||
        !existingAttendance.checkInLongitude ||
        !existingAttendance.checkInPhoto
      ) {
        const updated = await attendanceModel
          .findByIdAndUpdate(existingAttendance._id, {
            checkInLatitude: checkInLatitude,
            checkInLongitude: checkInLongitude,
            checkInPhoto: checkInPhoto,
            checkInTime: now,
            status: "active",
          })
          .populate(attendancePopulateOption);
        return res.send(
          successRes(200, "Check-in successful", {
            data: updated,
          })
        );
      }

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
      status: "active",
    });

    await newAttendance.save();
    const newAtt = await attendanceModel
      .findById(newAttendance?._id)
      .populate(attendancePopulateOption);

    return res.send(successRes(200, "Check-in successful", { data: newAtt }));
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Check-In Endpoint
attendanceRouter.get("/get-check-in/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const now = new Date();
    const existingAttendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

    return res.send(
      successRes(200, "Checked In", {
        data: existingAttendance,
      })
    );
  } catch (error) {
    console.error(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

// Check-In Endpoint
attendanceRouter.get("/get-check-in-by-date", async (req, res) => {
  const { date } = req.query;
  try {
    let now = new Date();
    if (date) {
      now = new Date(date);
    }
    const existingAttendance = await attendanceModel
      .find({
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);
    const presentList = existingAttendance.filter(
      (ele) => ele.status === "active" || ele.status === "present"
    );
    const absentList = existingAttendance.filter(
      (ele) => ele.status === "absent"
    );
    const weekOffList = existingAttendance.filter(
      (ele) => ele.status === "weekoff"
    );

    const onLeaveList = existingAttendance.filter(
      (ele) => ele.status === "on-leave"
    );

    const lateComersList = [];
    const earlyLeaversList = [];

    return res.send(
      successRes(200, "Attendance List", {
        presentCount: presentList.length,
        absentCount: absentList.length,
        weekOffCount: weekOffList.length,
        onLeaveCount: onLeaveList.length,
        lateComersCount: lateComersList.length,
        earlyLeaversCount: earlyLeaversList.length,
        data: presentList,
        presentList,
        absentList,
        weekOffList,
        onLeaveList,
        lateComersList,
        earlyLeaversList,
      })
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
    const attendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

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
    const attendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

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
    const attendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

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
    const difference = calculateHoursDifferenceWithTZ(attendance.checkInTime);
    if (difference < 3) {
      attendance.status = "absent";
    } else if (difference > 3 && difference < 7) {
      attendance.status = "half-day";
    } else if (difference > 7) {
      attendance.status = "present";
    }
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
    const attendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

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
    const attendance = await attendanceModel
      .findOne({
        userId,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
      .populate(attendancePopulateOption);

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

attendanceRouter.get("/attendance/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(40, "id is required"));

    const resp = await attendanceModel
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .populate(attendancePopulateOption);
    // .populate(attendancePopulateOption);

    return res.send(
      successRes(200, "attendance", {
        data: resp,
      })
    );
  } catch (e) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

attendanceRouter.get("/export-attendance", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Total days in the month
    const timeZone = "Asia/Kolkata";

    // Fetch attendance records for the current month with populated user details
    const attendanceRecords = await attendanceModel
      .find({
        month: currentMonth,
        year: currentYear,
      })
      .populate(attendancePopulateOption);

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Organize attendance data by userId
    const usersAttendance = {};
    for (const record of attendanceRecords) {
      const user = record.userId;

      if (!user || !user._id) {
        continue; // Skip records with missing user data
      }

      if (!usersAttendance[user._id]) {
        usersAttendance[user._id] = {
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            designation: user.designation,
            division: user.division,
            department: user.department,
            employeeId: user.employeeId,
            checkInTime: record.checkInTime,
            checkOutTime: record.checkOutTime,
          },
          days: Array(daysInMonth).fill("A"), // Default all days to "Absent"
          present: 0,
          onleave: 0,
          absent: daysInMonth, // Default all days as absent initially
        };
      }

      const dayIndex = record.day - 1; // Convert day to 0-indexed for the array
      if (record.status === "completed" || record.status === "present") {
        if (usersAttendance[user._id].days[dayIndex] === "A") {
          usersAttendance[user._id].absent -= 1; // Reduce absent count
        }
        usersAttendance[user._id].days[dayIndex] = `P`; // Mark as present

        // usersAttendance[user._id].days[dayIndex] = `P-${moment(
        //   record.checkInTime
        // )
        //   .tz(timeZone)
        //   .format("DD-MM-YYYY HH:mm")}/${moment(record.checkOutTime)
        //   .tz(timeZone)
        //   .format("DD-MM-YYYY HH:mm")}`; // Mark as present

        usersAttendance[user._id].present += 1;
      } else if (record.status === "weekoff") {
        if (usersAttendance[user._id].days[dayIndex] === "A") {
          usersAttendance[user._id].absent -= 1; // Reduce absent count
        }
        usersAttendance[user._id].days[dayIndex] = `WO`; // Mark as present
      } else if (record.status === "on-leave") {
        if (usersAttendance[user._id].days[dayIndex] === "A") {
          usersAttendance[user._id].absent -= 1; // Reduce absent count
          usersAttendance[user._id].onleave += 1; // Reduce absent count
        }
        usersAttendance[user._id].days[dayIndex] = `L`; // Mark as present
      }
    }

    // Prepare header row for Excel
    const headerRow = [
      "ID",
      "Employee ID",
      "First Name",
      "Last Name",
      "Designation",
      "Division",
      "Department",
    ];
    for (let i = 1; i <= daysInMonth; i++) {
      headerRow.push(`${i}`); // Dynamically create headers for total days in the month
    }
    headerRow.push(
      "Total Present Days",
      "Total Absent Days",
      "Total Leaves Taken",
      "Payable Days"
    );

    // Prepare data rows for Excel
    const excelData = [headerRow];
    Object.entries(usersAttendance).forEach(([userId, attendance], index) => {
      const {
        firstName,
        lastName,
        designation,
        division,
        department,
        employeeId,
        checkInTime,
        checkOutTime,
      } = attendance.user;
      const row = [
        index + 1, // ID
        employeeId,
        firstName,
        lastName,
        designation?.designation,
        division?.division,
        department?.department,
        ...attendance.days,
        attendance.present,
        attendance.absent,
        attendance.onleave,
        attendance.present,
      ];
      excelData.push(row);
    });

    // Create a workbook and add data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed Attendance");

    // Generate Excel file
    const filePath = path.join(__dirname, "detailed_attendance.xlsx");
    XLSX.writeFile(workbook, filePath);

    // Send file as a response
    res.download(filePath, "detailed_attendance.xlsx", (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).json({ message: "Failed to download file." });
      } else {
        // Delete file after download
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error("Error exporting detailed attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
});
const calculateHoursDifferenceWithTZ = (passedDate) => {
  const timeZone = "Asia/Kolkata";

  const now = moment.tz(timeZone); // Current time in specified time zone
  const past = moment.tz(passedDate, timeZone); // Passed date in same time zone

  const diffInHours = now.diff(past, "hours", true);
  return diffInHours;
};

attendanceRouter.post("/attendance-difference", async (req, res) => {
  const { checkInTime } = req.body;

  const difference = calculateHoursDifferenceWithTZ(checkInTime);
  res.json({ data: difference });
});

attendanceRouter.post("/attendance-fill", async (req, res) => {
  try {
    const resp = await insertDailyAttendance();
    return res.send({
      total: resp?.length,
      data: resp,
    });
  } catch (error) {
    return res.send(error);
  }
});
export const insertDailyAttendance = async () => {
  try {
    // const formattedDate = new Date();
    const formattedDate = moment
      .tz("Asia/Kolkata")
      .startOf("day")
      .add(5, "hours")
      .toDate();

    const employees = await employeeModel.find({ status: "active" }, "_id");

    const attendanceRecords = employees.map((employee) => ({
      userId: employee._id,
      day: formattedDate.getDay(),
      month: formattedDate.getMonth() + 1,
      year: formattedDate.getFullYear(),
      status: "absent",
    }));
    await attendanceModel.insertMany(attendanceRecords);
    return attendanceRecords;
  } catch (error) {
    return error;
  }
};

export const markPendingDailyAttendance = async () => {
  try {
    // const today = new Date();
    const today = moment
      .tz("Asia/Kolkata")
      .startOf("day")
      // .add(5, "hours")
      .toDate();

    const pendingresp = await attendanceModel.updateMany(
      {
        day: today.getDay(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        checkOutTime: null,
      },
      { status: "pending" }
    );

    return pendingresp;
  } catch (error) {
    return error;
  }
};

export default attendanceRouter;
