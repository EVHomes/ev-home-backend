import config from "../config/config.js";
import { validateRegisterEmployeeFields } from "../middleware/employee.middleware.js";
import cpModel from "../model/channelPartner.model.js";
import employeeModel from "../model/employee.model.js";
import otpModel from "../model/otp.model.js";
import { errorRes, successRes } from "../model/response.js";
import { errorMessage } from "../utils/constant.js";
import {
  comparePassword,
  createJwtToken,
  encryptPassword,
  generateOTP,
} from "../utils/helper.js";

export const getEmployees = async (req, res, next) => {
  try {
    const respCP = await employeeModel
      .find()
      .select("-password -refreshToken")
      .populate("designation")
      .populate("department")
      .populate("division")
      .populate({
        path: "reportingTo",
        select: "-password -refreshToken",
        populate: [{ path: "designation" }, { path: "department" }, { path: "division" }],
      });

    return res.send(
      successRes(200, "get Employees", {
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
  }
};
export const getClosingManagers = async (req, res, next) => {
  try {
    const respCP = await employeeModel
      .find({
        $or: [
          {
            designation: "670e5434de5adb5e87eb8d77",
          },
          {
            designation: "670e544bde5adb5e87eb8d7d",
          },
        ],
      })
      .select("-password -refreshToken")
      .populate("designation")
      .populate("department")
      .populate("division")
      .populate({
        path: "reportingTo",
        select: "-password -refreshToken",
        populate: [{ path: "designation" }, { path: "department" }, { path: "division" }],
      });

    return res.send(
      successRes(200, "get Employees", {
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respEmployee = await employeeModel
      .findById(id)
      .select("-password -refreshToken")
      .populate("designation")
      .populate("department")
      .populate("division")
      .populate({
        path: "reportingTo",
        select: "-password -refreshToken",
        populate: [{ path: "designation" }, { path: "department" }, { path: "division" }],
      });
    //if not found
    if (!respEmployee) {
      return res.send(errorRes(404, errorMessage.EMP_NOT_FOUND));
    }
    //if found
    return res.send(
      successRes(200, `get Employee by id ${id}`, {
        data: respEmployee,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const editEmployeeById = async (req, res, next) => {
  const id = req.params.id;
  const body = req.filteredBody;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    if (!body) return res.send(errorRes(403, "valid data is required"));
    // console.log(body);

    // return res.send(errorRes(404, `test success`));
    const respEmployee = await employeeModel
      .findById(id)
      .select("-password -refreshToken");

    //if not found
    if (!respEmployee) {
      return res.send(errorRes(404, errorMessage.EMP_NOT_FOUND));
    }

    await respEmployee.updateOne({ ...body }, { new: true });

    //if all ok
    return res.send(
      successRes(200, errorMessage.EMP_INFO_UPDATED, {
        data: respEmployee,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const deleteEmployeeById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respCP = await employeeModel.findById(id);

    //if not found
    if (!respCP) {
      return res.send(errorRes(404, errorMessage.EMP_NOT_FOUND));
    }
    const deletedResp = await respCP.deleteOne();
    //if found
    return res.send(
      successRes(200, errorMessage.EMP_DELETED, {
        data: deletedResp.acknowledged,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const registerEmployee = async (req, res, next) => {
  const body = req.filteredBody;
  const { email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    const validateFields = validateRegisterEmployeeFields(body);

    if (!validateFields.isValid) {
      return res.send(errorRes(400, validateFields.message));
    }

    const oldUser = await employeeModel.findOne({
      email: email,
    });

    if (oldUser) {
      return res.send(errorRes(400, errorMessage.EMP_EMAIL_EXIST));
    }

    const hashPassword = await encryptPassword(password);

    const newChannelPartner = new employeeModel({
      ...body,
      password: hashPassword,
    });
    const savedEmployee = await newChannelPartner.save();

    const {
      password: dbPassword,
      refreshToken: dbRefreshToken,
      ...userWithoutPassword
    } = savedEmployee._doc;

    const dataToken = {
      _id: savedEmployee._id,
      email: savedEmployee.email,
      role: savedEmployee.role,
    };

    const accessToken = createJwtToken(dataToken, config.SECRET_ACCESS_KEY, "15m");
    const refreshToken = createJwtToken(dataToken, config.SECRET_REFRESH_KEY, "7d");
    savedEmployee.refreshToken = refreshToken;
    await savedEmployee.save();

    return res.send(
      successRes(200, errorMessage.EMP_REGISTER_SUCCESS, {
        data: userWithoutPassword,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.send(errorRes(400, `${error.keyValue.employeeId} already exists.`));
    }

    return next(error);
  }
};

export const loginEmployee = async (req, res, next) => {
  const body = req.filteredBody;
  const { email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));
    if (!password) return res.send(errorRes(403, "password is required"));

    const employeeDb = await employeeModel
      .findOne({
        email: email,
      })
      .populate("designation")
      .populate("department")
      .populate("division")
      .populate({
        path: "reportingTo",
        select: "-password -refreshToken",
        populate: [{ path: "designation" }, { path: "department" }, { path: "division" }],
      });

    // .lean();

    if (!employeeDb) {
      return res.send(errorRes(400, errorMessage.EMP_EMAIL_NOT_EXIST));
    }

    const hashPass = await comparePassword(password, employeeDb.password);

    if (!hashPass) {
      return res.status(400).json({ message: errorMessage.INVALID_PASS });
    }

    const { password: dbPassword, ...userWithoutPassword } = employeeDb._doc;
    const dataToken = {
      _id: employeeDb._id,
      email: employeeDb.email,
      role: employeeDb.role,
    };

    const accessToken = createJwtToken(dataToken, config.SECRET_ACCESS_KEY, "15m");
    const refreshToken = createJwtToken(dataToken, config.SECRET_REFRESH_KEY, "7d");
    await employeeDb.updateOne(
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    return res.send(
      successRes(200, errorMessage.EMP_LOGIN_SUCCESS, {
        data: userWithoutPassword,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const reAuthEmployee = async (req, res, next) => {
  const body = req.body;
  const { email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));
    if (!password) return res.send(errorRes(403, "password is required"));

    const employeeDb = await employeeModel
      .findOne({
        email: email,
      })
      .lean();

    if (!employeeDb) {
      return res.send(errorRes(400, errorMessage.EMP_NOT_FOUND));
    }

    const hashPass = await comparePassword(password, employeeDb.password);

    if (!hashPass) {
      return res.send(errorRes(401, errorMessage.INVALID_PASS));
    }

    return res.send(
      successRes(200, "You have been successfully authenticated", {
        data: true,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const forgotPasswordEmployee = async (req, res, next) => {
  const body = req.body;
  const { email } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));

    const oldOtp = await otpModel.findOne({ email: email }).lean();

    if (oldOtp) {
      return res.send(successRes(200, `Your OTP has been re-sent to ${email}`, oldOtp));
    }

    const employeeDb = await employeeModel
      .findOne({
        email: email,
      })
      .lean();

    if (!employeeDb) {
      return res.send(errorRes(400, `No Employee found with given email: ${email}`));
    }

    const newOtp = generateOTP(4);
    const newOtpModel = new otpModel({
      otp: newOtp,
      docId: employeeDb._id,
      email: email,
      type: "employees",
      message: "forgot passsword",
    });

    const savedOtp = await newOtpModel.save();

    return res.send(successRes(200, `Your OTP has been sent to ${email}`, savedOtp._doc));
  } catch (error) {
    return next(error);
  }
};

export const resetPasswordEmployee = async (req, res, next) => {
  const body = req.body;
  const { otp, email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!otp) return res.send(errorRes(403, "otp is required"));
    if (!email) return res.send(errorRes(403, "email is required"));
    if (!password) return res.send(errorRes(403, "password is required"));

    const otpDbResp = await otpModel
      .findOne({
        email: email,
      })
      .lean();

    if (!otpDbResp) {
      return res.send(errorRes(404, "Invalid Otp"));
    }
    if (otpDbResp.otp != otp) {
      return res.send(errorRes(401, "Otp didn't matched"));
    }
    const employeeDb = await employeeModel.findById(otpDbResp.docId).lean();
    if (!employeeDb) {
      return res.send(errorRes(404, "No Employee found with given email"));
    }
    const hashPassword = await encryptPassword(password);
    const updatedPassChannelPartner = await employeeModel.updateOne(
      {
        _id: employeeDb._id,
      },
      {
        password: hashPassword,
      }
    );
    await otpModel.deleteOne({ _id: otpDbResp._id });

    return res.send(
      successRes(200, `Reset password sucessfully for: ${otpDbResp.email}`, {
        data: updatedPassChannelPartner.acknowledged,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const searchEmployee = async (req, res, next) => {
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
        // { phoneNumber: { $regex: query, $options: "i" } },
        isNumberQuery ? { phoneNumber: Number(query) } : null,
        { email: { $regex: query, $options: "i" } },
        { firmName: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { reraNumber: { $regex: query, $options: "i" } },
      ].filter(Boolean),
    };

    const respEmp = await employeeModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .select("-password -refreshToken");

    // Count the total items matching the filter
    const totalItems = await employeeModel.countDocuments(searchFilter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get Employee", {
        page,
        limit,
        totalPages,
        totalItems,
        items: respEmp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
