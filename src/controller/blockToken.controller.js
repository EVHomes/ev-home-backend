import { errorRes, successRes } from "../model/response.js";
import blockedTokenModel from "../model/token.model.js";

export const getBlockedTokens = async (req, res, next) => {
  try {
    const tokens = await blockedTokenModel.find();

    res.send(
      successRes(200, "get all blocked Tokens", {
        data: tokens,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const searchBlockedTokens = async (req, res, next) => {
  try {
    let query = req.query.query || "";
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;

    let searchFilter = {
      $or: [{ token: { $regex: query, $options: "i" } }].filter(Boolean),
    };

    const respCP = await blockedTokenModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .select("-password -refreshToken");

    // Count the total items matching the filter
    const totalItems = await blockedTokenModel.countDocuments(searchFilter);

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

export const addBlockToken = async (req, res, next) => {
  const { type, token } = req.body;

  try {
    if (!type) return res.send(errorRes(404, "Type required"));

    if (!token) return res.send(errorRes(404, "Token required"));

    const oldToken = await blockedTokenModel.findOne({ token: token });

    if (oldToken) {
      return res.send(
        successRes(200, "Token already in blocklist", {
          data: oldToken,
        })
      );
    }

    const newToken = new blockedTokenModel({ token, type });

    await newToken.save();

    return res.send(
      successRes(200, "added New Token", {
        data: newToken,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const deleteBLockedToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    if (!token) return res.send(errorRes(404, "Token Param required"));

    const oldToken = await blockedTokenModel.find({ token });

    if (!oldToken)
      return res.send(errorRes(404, "Token didn't exist in our record"));

    const deleteResp = await blockedTokenModel.findOneAndDelete({
      token: token,
    });

    return res.send(
      successRes(200, "Deleted Token successfully", {
        data: deleteResp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
