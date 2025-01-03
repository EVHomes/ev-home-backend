//TODO: faceIds model
import mongoose from "mongoose";
export const faceIdSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "employees",
    },
    faceId: {
      type: String,
      default: null,
    },
    shift: {
      type: String,
      default: null,
      ref: "shift",
    },
    status: {
      type: String,
      default: "pending-approval",
    },
    geoFence: [
      {
        type: String,
        default: null,
        ref: "geofence",
      },
    ],
    penalty: [
      {
        type: String,
        default: null,
        ref: "penalty",
      },
    ],
  },
  { timestamps: true }
);

const faceIdModel = mongoose.model("faceId", faceIdSchema, "faceIds");
export default faceIdModel;
