import cpModel from "../model/channelPartner.model.js";

export const getChannelPartners = async (req, res) => {
  try {
    const respCP = await cpModel.find();

    return res.send(respCP);
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};
