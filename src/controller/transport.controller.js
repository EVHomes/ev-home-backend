import { errorRes, successRes } from "../model/response.js";
import TransportModel from "../model/transport.model.js";
import vehicleModel from "../model/vehicle.model.js";
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
    vehicle,
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
    // await vehicleModel.findByIdAndUpdate(vehicle, { status: true });
    const resp2 = await TransportModel.findById(resp._id).populate(
      tansportPopulateOptions
    );

    return res.send(successRes(200, "Added Transport", { data: resp2 }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const approveTransport = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    console.log(req.body);
    // if (!id) return res.send(errorRes(401, "id is required"));

    // await vehicleModel.findByIdAndUpdate(vehicle, { status: true });
    const resp2 = await TransportModel.findByIdAndUpdate(id, {
      stage: status.toLowerCase() === "approved" ? "approved" : "rejected",
      approvalStatus: status,
    }).populate(tansportPopulateOptions);

    if (status.toLowerCase() === "approved") {
      await vehicleModel.findByIdAndUpdate(resp2.vehicle._id, { status: true });
    }

    return res.send(successRes(200, "Added Transport", { data: resp2 }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const completedTransport = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!id) return res.send(errorRes(401, "id is required"));

    // await vehicleModel.findByIdAndUpdate(vehicle, { status: true });
    const resp2 = await TransportModel.findByIdAndUpdate(id, {
      stage: "completed",
      jurneyStatus: "completed",
    }).populate(tansportPopulateOptions);

    await vehicleModel.findByIdAndUpdate(resp2.vehicle._id, { status: false });

    return res.send(successRes(200, "Added Transport", { data: resp2 }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const startJourney = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "Transport ID is required"));

    const transport = await TransportModel.findByIdAndUpdate(id, {
      stage: "ontheway",
      jurneyStatus: "ontheway",
    }).populate(tansportPopulateOptions);
    if (!transport) return res.send(errorRes(404, "Transport not found"));

    await vehicleModel.findByIdAndUpdate(transport.vehicle._id, {
      status: true,
    });

    return res.send(
      successRes(200, "Journey started successfully", {
        data: transport,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};
