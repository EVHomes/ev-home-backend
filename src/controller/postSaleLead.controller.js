import postSaleLeadModel from "../model/postSaleLead.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getPostSaleLeads = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;

    let skip = (page - 1) * limit;

    const resp = await postSaleLeadModel.find().sort({ date: -1 });
    // .skip(skip)
    // .limit(limit)

    // Count the total items matching the filter
    const totalItems = await postSaleLeadModel.countDocuments({
      // teamLeader: { $eq: teamLeaderId },
    });
    const registrationDone = await postSaleLeadModel.countDocuments({
      status: "Registration Done",
    });
    const eoiRecieved = await postSaleLeadModel.countDocuments({
      status: "EOI Recieved",
    });
    const cancelled = await postSaleLeadModel.countDocuments({
      status: "Cancelled",
    });
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get post sale leads", {
        page,
        limit,
        totalItems,
        totalPages,
        registrationDone,
        eoiRecieved,
        cancelled,
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const addPostSaleLead = async (req, res, next) => {
  const body = req.body;
  const {
    firstName,
    lastName,
    email,
    unitNo,
    project,
    address,
    carpetArea,
    flatCost,
    phoneNumber,
  } = body;
  try {
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    // const resp = await postSaleLeadModel.find();
    const resp = await postSaleLeadModel.create({
      ...body,
    });

    return res.send(
      successRes(200, "add post sale leads", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updatePostSaleLeadById = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  try {
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    const foundLead = await postSaleLeadModel.findById(id);

    if (!foundLead) return res.send(errorRes(404, "No lead found"));

    await foundLead.updateOne({ ...body });

    return res.send(
      successRes(200, "updated post sale lead", {
        data: foundLead,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const deletePostSaleLeadBydId = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  try {
    if (!body) return res.send(errorRes(401, "No Data Provided"));

    const foundLead = await postSaleLeadModel.findByIdAndDelete(id);

    if (!foundLead) return res.send(errorRes(404, "No lead found"));

    return res.send(
      successRes(200, "deleted post sale lead", {
        data: foundLead,
      })
    );
  } catch (error) {
    return next(error);
  }
};
