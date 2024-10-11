import config from "../config/config.js";
import { validateRegisterCPFields } from "../middleware/channelPartner.middleware.js";
import cpModel from "../model/channelPartner.model.js";
import otpModel from "../model/otp.model.js";
import { errorRes, successRes } from "../model/response.js";
import {
  comparePassword,
  createJwtToken,
  encryptPassword,
  generateOTP,
} from "../utils/helper.js";

export const getChannelPartners = async (req, res, next) => {
  try {
    const respCP = await cpModel.find().select("-password -refreshToken");

    return res.send(
      successRes(200, "get Channel Partners", {
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const searchChannelPartners = async (req, res, next) => {
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

    const respCP = await cpModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .select("-password -refreshToken");

    // Count the total items matching the filter
    const totalItems = await cpModel.countDocuments(searchFilter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get Channel Partners", {
        page,
        limit,
        totalPages,
        totalItems,
        items: respCP,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getChannelPartnerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respCP = await cpModel.findById(id).select("-password -refreshToken");

    //if not found
    if (!respCP) {
      return res.send(
        errorRes(404, `Channel Partner not found with id: ${id}`)
      );
    }
    //if found
    return res.send(
      successRes(200, `get Channel Partner by id ${id}`, {
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const editChannelPartnerById = async (req, res, next) => {
  const id = req.params.id;
  const body = req.filteredBody;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    if (!body) return res.send(errorRes(403, "valid data is required"));

    const respCP = await cpModel.findById(id);

    //if not found
    if (!respCP) {
      return res.send(
        errorRes(404, `Channel Partner not found with id: ${id}`)
      );
    }
    await respCP.updateOne(
      {
        ...body,
      },
      { new: true }
    );

    // const updateResp = await cpModel.updateOne(
    //   { _id: id },
    //   {
    //     ...body,
    //   }
    // );

    //if all ok
    return res.send(
      successRes(200, `updated Channel Partner by id ${id}`, {
        data: respCP,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const deleteChannelPartnerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respCP = await cpModel.findById(id);

    //if not found
    if (!respCP) {
      return res.send(
        errorRes(404, `Channel Partner not found with id: ${id}`)
      );
    }
    const deletedResp = await respCP.deleteOne();
    //if found
    return res.send(
      successRes(200, `deleted Channel Partner by id ${id}`, {
        data: deletedResp,
      })
    );
  } catch (error) {
    return next(error);
    // return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const registerChannelPartner = async (req, res, next) => {
  const body = req.filteredBody;
  const { email, phoneNumber, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (password.length < 6) {
      return res.send(
        errorRes(400, "Password should be at least 6 character long.")
      );
    }
    const validateFields = validateRegisterCPFields(body);
    if (!validateFields)
      return res.send(errorRes(401, "All field is required"));
    const oldUser = await cpModel
      .findOne({
        $or: [
          {
            email: email,
          },
          { phoneNumber: phoneNumber },
        ],
      })
      .lean();

    if (oldUser) {
      return res.send(
        errorRes(400, "Account already exist with this email Or Phone number")
      );
    }

    const hashPassword = await encryptPassword(password);

    const newChannelPartner = new cpModel({
      ...body,
      password: hashPassword,
    });
    const savedCp = await newChannelPartner.save();

    const { password: dbPassword, ...userWithoutPassword } = savedCp._doc;
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
    savedCp.refreshToken = refreshToken;
    await savedCp.save();

    return res.send(
      successRes(200, "channel partner is registered", {
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const loginChannelPartner = async (req, res, next) => {
  const body = req.body;
  const { email, phoneNumber, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));
    if (!password) return res.send(errorRes(403, "password is required"));

    const channelPartnerDb = await cpModel
      .findOne({
        email: email,
      })
      .lean();

    if (!channelPartnerDb) {
      return res.send(
        errorRes(400, "No Channel Partner found with given email")
      );
    }

    // const hashPassword = await encryptPassword(password);

    const hashPass = await comparePassword(password, channelPartnerDb.password);

    if (!hashPass) {
      return res.status(400).json({ message: "Password didn't Matched" });
    }

    // const newChannelPartner = new cpModel({
    //   ...body,
    //   password: hashPassword,
    // });
    // const savedCp = await newChannelPartner.save();

    const { password: dbPassword, ...userWithoutPassword } = channelPartnerDb;
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

    await cpModel.updateOne(
      { _id: channelPartnerDb._id },
      {
        refreshToken: refreshToken,
      }
    );
    // savedCp.refreshToken = refreshToken;
    // await savedCp.save();

    return res.send(
      successRes(200, "channel partner login successful", {
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const reAuthChannelPartner = async (req, res, next) => {
  const body = req.body;
  const { email, password } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));
    if (!password) return res.send(errorRes(403, "password is required"));

    const channelPartnerDb = await cpModel
      .findOne({
        email: email,
      })
      .lean();

    if (!channelPartnerDb) {
      return res.send(
        errorRes(400, "No Channel Partner found with given email")
      );
    }

    const hashPass = await comparePassword(password, channelPartnerDb.password);

    if (!hashPass) {
      return res.send(errorRes(401, "Password didn't Matched"));
    }

    return res.send(
      successRes(200, "channel partner is verified", {
        status: true,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const forgotPasswordChannelPartner = async (req, res, next) => {
  const body = req.body;
  const { email } = body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!email) return res.send(errorRes(403, "email is required"));

    const oldOtp = await otpModel.findOne({ email: email }).lean();

    if (oldOtp) {
      return res.send(successRes(200, `otp re-sent to ${email}`, oldOtp));
    }

    const channelPartnerDb = await cpModel
      .findOne({
        email: email,
      })
      .lean();

    if (!channelPartnerDb) {
      return res.send(errorRes(400, `No Channel Partner found with ${email}`));
    }

    const newOtp = generateOTP(4);
    const newOtpModel = new otpModel({
      otp: newOtp,
      docId: channelPartnerDb._id,
      email: email,
      type: "channel-partner",
      message: "forgot passsword",
    });

    const savedOtp = await newOtpModel.save();

    return res.send(successRes(200, `otp sent to ${email}`, savedOtp._doc));
  } catch (error) {
    return next(error);
  }
};

export const resetPasswordChannelPartner = async (req, res, next) => {
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
    const channelPartnerDb = await cpModel.findById(otpDbResp.docId).lean();
    if (!channelPartnerDb) {
      return res.send(
        errorRes(404, "No Channel Partner found with given email")
      );
    }
    const hashPassword = await encryptPassword(password);
    const updatedPassChannelPartner = await cpModel.updateOne(
      {
        _id: channelPartnerDb._id,
      },
      {
        password: hashPassword,
      }
    );

    await otpModel.deleteOne({ _id: otpDbResp._id });

    return res.send(
      successRes(200, `Reset password sucessfully for: ${otpDbResp.email}`, {
        status: updatedPassChannelPartner.acknowledged,
      })
    );
  } catch (error) {
    return next(error);
  }
};
