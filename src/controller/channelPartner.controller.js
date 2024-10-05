import cpModel from "../model/channelPartner.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getChannelPartners = async (req, res) => {
  try {
    const respCP = await cpModel.find();

    return res.send(
      successRes(200, "get channel Partners", {
        data: respCP,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error: ${error?.message}`));
  }
};

export const getChannelPartnerById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respCP = await cpModel.findOne({ id });

    //if not found
    if (!respCP)
      return res.send(
        successRes(404, `Channel Partner not found with id: ${id}`, {
          data: respCP,
        })
      );

    //if found
    return res.send(
      successRes(200, `get Channel Partner by id ${id}`, {
        data: respCP,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const registerChannelPartner = async (req, res) => {
  const body = req.body;
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    const respCP = await cpModel.findOne({ id });

    return res.send(
      successRes(200, `get Channel Partner by id ${id}`, {
        data: respCP,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};
