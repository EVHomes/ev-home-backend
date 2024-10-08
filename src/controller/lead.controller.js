import leadModel from "../model/lead.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getAllLeads = async (req, res, next) => {
  try {
    const respLeads = await leadModel.find();

    if (!respLeads) return errorRes(404, "No leads found");

    return res.send(
      successRes(200, "all Leads", {
        data: respLeads,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));

    const respLead = await leadModel.findById(id);
    if (!respLead) return errorRes(404, "No lead found");

    return res.send(
      successRes(200, "lead by id", {
        data: respLead,
      })
    );
  } catch (error) {
    next(error);
  }
};
