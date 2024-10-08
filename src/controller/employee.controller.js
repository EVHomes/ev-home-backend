import config from "../config/config.js";
import cpModel from "../model/channelPartner.model.js";
import employeeModel from "../model/employee.model.js";
import otpModel from "../model/otp.model.js";
import { errorRes, successRes } from "../model/response.js";
import {
  comparePassword,
  createJwtToken,
  encryptPassword,
  generateOTP,
} from "../utils/helper.js";

export const getEmployees = async (req, res, next) => {
  try {
    const respCP = await cpModel.find().select("-password");

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
    const respEmployee = await employeeModel.findById(id);

    //if not found
    if (!respEmployee) {
      return res.send(errorRes(404, `Employee not found with id: ${id}`));
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

    const respEmployee = await employeeModel.findById(id);

    //if not found
    if (!respEmployee) {
      return res.send(errorRes(404, `Employee not found with id: ${id}`));
    }

    const updateResp = await employeeModel.updateOne(
      { _id: id },
      {
        ...body,
      }
    );

    //if all ok
    return res.send(
      successRes(200, `updated Employee by id ${id}`, {
        data: updateResp.acknowledged,
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
      return res.send(errorRes(404, `Employee not found with id: ${id}`));
    }
    const deletedResp = await respCP.deleteOne();
    //if found
    return res.send(
      successRes(200, `Deleted Employee by id ${id}`, {
        data: deletedResp.acknowledged,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const registerEmployee = async (req, res, next) => {
  const body = req.body;
  const { email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));

    if (password.length < 6) {
      return res.send(
        errorRes(400, "Password should be at least 6 character long.")
      );
    }

    const oldUser = await employeeModel
      .findOne({
        email: email,
      })
      .lean();

    if (oldUser) {
      return res.send(errorRes(400, "Employee already exist with this email"));
    }

    const hashPassword = await encryptPassword(password);

    const newChannelPartner = new employeeModel({
      ...body,
      password: hashPassword,
    });
    const savedEmployee = await newChannelPartner.save();

    const { password: dbPassword, ...userWithoutPassword } = savedEmployee._doc;
    const accessToken = createJwtToken(
      userWithoutPassword,
      config.SECRET_ACCESS_KEY,
      "15m"
    );
    const refreshToken = createJwtToken(
      userWithoutPassword,
      config.SECRET_REFRESH_KEY,
      "7d"
    );
    savedEmployee.refreshToken = refreshToken;
    await savedEmployee.save();

    return res.send(
      successRes(200, "Employee is registered successfully", {
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    if (error.code === 11000) {
      return res.send(
        errorRes(400, `${error.keyValue.employeeId} already exists.`)
      );
    }

    return next(error);
  }
};

export const loginEmployee = async (req, res, next) => {
  const body = req.body;
  const { email, phoneNumber, password } = body;
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
      return res.send(errorRes(400, "No Employee found with given email"));
    }

    const hashPass = await comparePassword(password, employeeDb.password);

    if (!hashPass) {
      return res.status(400).json({ message: "Password didn't Matched" });
    }

    const { password: dbPassword, ...userWithoutPassword } = employeeDb;
    const accessToken = createJwtToken(
      userWithoutPassword,
      config.SECRET_ACCESS_KEY,
      "15m"
    );
    const refreshToken = createJwtToken(
      userWithoutPassword,
      config.SECRET_REFRESH_KEY,
      "7d"
    );
    await employeeModel.updateOne(
      { _id: employeeDb._id },
      {
        refreshToken: refreshToken,
      }
    );
    // employeeDb.refreshToken = refreshToken;
    // await employeeDb.save();

    return res.send(
      successRes(200, "Employee Login successful", {
        ...userWithoutPassword,
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
      return res.send(errorRes(400, "No Employee found with given email"));
    }

    const hashPass = await comparePassword(password, employeeDb.password);

    if (!hashPass) {
      return res.send(errorRes(401, "Password didn't matched"));
    }

    return res.send(
      successRes(200, "Employee is registered", {
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
      return res.send(successRes(200, `otp re-sent to ${email}`, oldOtp));
    }

    const employeeDb = await employeeModel
      .findOne({
        email: email,
      })
      .lean();

    if (!employeeDb) {
      return res.send(errorRes(400, `No Channel Partner found with ${email}`));
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

    return res.send(successRes(200, `otp sent to ${email}`, savedOtp._doc));
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
