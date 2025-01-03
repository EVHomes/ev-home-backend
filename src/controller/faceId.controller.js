import { errorRes, successRes } from "../model/response.js";
import faceIdModel from "../model/faceId.model.js";

export const getFaceIds = async (req, res, next) => {
  try {
    const resp = await faceIdModel.find();

    return res.send(
      successRes(200, "get FaceIds", {
        data: resp,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const addFaceId = async (req, res, next) => {
  const { shift, userId, geofence, faceId, status, panalty } = req.body;

  try {
    if (!userId) return res.send(errorRes(401, "userId is required"));

    // Check if shift already exists
    const oldShift = await faceIdModel.findOne({ userId });

    if (oldShift) return res.send(errorRes(401, "FaceId Already Exist"));

    const newFaceIdId = "faceid-" + userId?.replace(/\s+/g, "-").toLowerCase();

    // Create a new shift with calculated shift hours
    const newFaceId = await faceIdModel.create({
      ...req.body,
      _id: newFaceIdId,
    });

    return res.send(
      successRes(200, "faceId added", {
        data: newFaceId,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const getFaceIdById = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(401, "id required"));

    const resp = await faceIdModel.findById(id);

    return res.send(
      successRes(200, "get faceid", {
        data: resp,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, "Internal Server Error"));
  }
};
