import { errorRes, successRes } from "../model/response.js";
import shiftModel from "../model/shift.model.js";
import employeeModel from "../model/employee.model.js"; // Assuming you have an Employee model


export const getShifts = async (req, res, next) => {
  try {
    const resp = await shiftModel.find();

    return res.send(
      successRes(200, "get shifts", {
        data: resp,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const addShift = async (req, res, next) => {
  const {
    shiftName,
    type,
    timeIn,
    timeOut,
    workingHours,
    graceTime,
    status,
    multiTimeInOut,
  } = req.body;

  try {
    
    if (!shiftName) return res.send(errorRes(401, "Shift Name is required"));
    if (type === undefined || type === null)
      return res.send(errorRes(401, "Shift type is required"));
    if (!timeIn) return res.send(errorRes(401, "timeIn is required"));
    if (!timeOut) return res.send(errorRes(401, "timeOut is required"));
    if (!workingHours)
      return res.send(errorRes(401, "workingHours is required"));
    if (!graceTime)
      return res.send(errorRes(401, "graceTime is required"));

    // Check if shift already exists
    const existingShift = await shiftModel.findOne({ shiftName: shiftName });
    if (existingShift) return res.send(errorRes(401, "Shift Already Exists"));

    // Generate a unique shift ID
    const shiftId = "shift-" + shiftName?.replace(/\s+/g, "-").toLowerCase();

    // Create a new shift
    const newShift = await shiftModel.create({
      _id: shiftId,
      shiftName,
      type,
      timeIn,
      timeOut,
      workingHours,
      graceTime: graceTime ?? 0, 
      status: status ?? true, 
      multiTimeInOut: multiTimeInOut ?? false, 
    });

    return res.send(
      successRes(200, "Shift added", {
        data: newShift,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const getShiftById = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(401, "Shift ID is required"));

    const shift = await shiftModel.findById(id);

    if (!shift) return res.send(errorRes(404, "Shift not found"));

    return res.send(
      successRes(200, "get shift", {
        data: shift,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const deleteShiftById = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.send(errorRes(401, "Shift ID is required"));
    }

    // Find and delete the shift by ID
    const deletedShift = await shiftModel.findByIdAndDelete(id);

    if (!deletedShift) {
      return res.send(errorRes(404, "Shift not found"));
    }

    return res.send(
      successRes(200, "Shift deleted successfully", {
        data: deletedShift,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const editShift = async (req, res, next) => {
  const id = req.params.id;
  const { shiftName, type, timeIn, timeOut, workingHours, graceTime, status, multiTimeInOut } = req.body;

  try {
    // Validation checks (similar to addShift route)
    if (!shiftName) return res.send(errorRes(401, "Shift Name is required"));
    if (type === undefined || type === null) return res.send(errorRes(401, "Shift type is required"));
    if (!timeIn) return res.send(errorRes(401, "timeIn is required"));
    if (!timeOut) return res.send(errorRes(401, "timeOut is required"));
    if (!workingHours) return res.send(errorRes(401, "workingHours is required"));
    if (!graceTime) return res.send(errorRes(401, "graceTime is required"));

    // Optionally, check if another shift with the same name already exists (if shiftName should be unique)
    const existingShift = await shiftModel.findOne({ shiftName });
    if (existingShift && existingShift._id !== id) {
      return res.send(errorRes(401, "Shift Name already exists"));
    }

    // Update shift by ID
    const updatedShift = await shiftModel.findByIdAndUpdate(id, {
      shiftName,
      type,
      timeIn,
      timeOut,
      workingHours,
      graceTime,
      status,
      multiTimeInOut,
    }, { new: true }); 

    if (!updatedShift) {
      return res.send(errorRes(404, "Shift not found"));
    }

    return res.send(successRes(200, "Shift updated successfully", { data: updatedShift }));
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};


export const assignShift = async (req, res) => {
  const { shiftId, employeeIds } = req.body;

  if (!shiftId || !employeeIds || !Array.isArray(employeeIds)) {
    return res.status(400).json({
      message: "Invalid request data. Shift ID and employee IDs are required.",
    });
  }

  try {
   
    const shift = await shiftModel.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found." });
    }

   
    const employees = await employeeModel.find({
      _id: { $in: employeeIds },
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        message: "One or more employee IDs are invalid.",
      });
    }

    
    shift.employees = [...new Set([...shift.employees, ...employeeIds])];

    
    await shift.save();

    return res.status(200).json({
      message: "Employees assigned to shift successfully.",
      data: shift,
    });
  } catch (error) {
    console.error("Error assigning employees to shift:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Fetch assigned employees for a shift
export const getAssignedEmployees = async (req, res) => {
  const { shiftId } = req.params;

  try {
    
    const shift = await shiftModel.findById(shiftId).populate('employees');
    if (!shift) {
      return res.status(404).json({ message: "Shift not found." });
    }

    return res.status(200).json({
      message: "Assigned employees retrieved successfully.",
      data: shift.employees,
    });
  } catch (error) {
    console.error("Error fetching assigned employees:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Add employees to a shift
export const addEmployeesToShift = async (req, res) => {
  const { shiftId } = req.params;
  const { employeeIds } = req.body;

  if (!Array.isArray(employeeIds)) {
    return res.status(400).json({
      message: "Invalid request data. Employee IDs must be an array.",
    });
  }

  try {
    
    const shift = await shiftModel.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found." });
    }

   
    const employees = await employeeModel.find({
      _id: { $in: employeeIds },
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        message: "One or more employee IDs are invalid.",
      });
    }

    
    shift.employees = [...new Set([...shift.employees, ...employeeIds])];

    
    await shift.save();

    return res.status(200).json({
      message: "Employees added to shift successfully.",
      data: shift,
    });
  } catch (error) {
    console.error("Error adding employees to shift:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Remove an employee from a shift
export const removeEmployeeFromShift = async (req, res) => {
  const { shiftId, employeeId } = req.params;

  try {
    
    const shift = await shiftModel.findById(shiftId);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found." });
    }

    
    const employeeIndex = shift.employees.indexOf(employeeId);
    if (employeeIndex !== -1) {
      shift.employees.splice(employeeIndex, 1);
      await shift.save();
      return res.status(200).json({ message: "Employee removed from shift successfully.", data: shift });
    } else {
      return res.status(404).json({ message: "Employee not found in this shift." });
    }
  } catch (error) {
    console.error("Error removing employee from shift:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
