import ChatResponseModel from "../model/chatResponse.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getDefaultOptionChatOptions = async (req, res) => {
  try {
    const resp = await ChatResponseModel.findOne({ id: "default" });

    return res.send(successRes(200, "chat option", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const addChatOptions = async (req, res) => {
  const { id, message, response, options, email, phoneNumber, type } = req.body;
  try {
    if (!id) return res.send(errorRes(401, "id is required"));
    if (!message) return res.send(errorRes(401, "message is required"));
    if (!type) return res.send(errorRes(401, "type is required"));

    const resp = await ChatResponseModel.create({
      ...req.body,
    });

    return res.send(successRes(200, "chat option", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};
