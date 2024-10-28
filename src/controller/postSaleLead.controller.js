import postSaleLeadModel from "../model/postSaleLead.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getPostSaleLeads = async (req, res, next) => {
  try {
    const resp = await postSaleLeadModel.find();

    return res.send(
      successRes(200, "get post sale leads", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const addPostSaleLead = async (req, res, next) => {
  const {} = req.body;
  try {
    const resp = await postSaleLeadModel.find();

    return res.send(
      successRes(200, "get post sale leads", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
