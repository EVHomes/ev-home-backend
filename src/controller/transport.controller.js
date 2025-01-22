import { errorRes, successRes } from "../model/response.js";
import TransportModel from "../model/transport.model.js";
import { tansportPopulateOptions } from "../utils/constant.js";

export const getTransports = async (req, res) => {
  try {
    const resp = await TransportModel.find().populate(tansportPopulateOptions);

    return res.send(successRes(200, "Get Transports", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const addTransport = async (req, res) => {
  const {
    startDate,
    destination,
    numberOfPassengers,
    clientName,
    clientEmail,
    clientPhone,
    manager,
    smanagerList,
  } = req.body;
  try {
    console.log(req.body);
    // if (!id) return res.send(errorRes(401, "id is required"));
    // if (!message) return res.send(errorRes(401, "message is required"));
    // if (!type) return res.send(errorRes(401, "type is required"));

    const resp = await TransportModel.create({
      ...req.body,
      startDate: new Date(startDate),
      pickupLocation: "679105383f865aa5d732512b",
    });

    const resp2 = await TransportModel.findById(resp._id).populate(
      tansportPopulateOptions
    );

    return res.send(successRes(200, "Added Transport", { data: resp2 }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};
