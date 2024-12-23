import { Router } from "express";
import {
  deleteChannelPartnerById,
  editChannelPartnerById,
  forgotPasswordChannelPartner,
  getChannelPartnerById,
  getChannelPartners,
  loginChannelPartner,
  newPassword,
  registerChannelPartner,
  resetPasswordChannelPartner,
  searchChannelPartners,
} from "../../controller/channelPartner.controller.js";
import { validateChannelPartnerFields } from "../../middleware/channelPartner.middleware.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import cpModel from "../../model/channelPartner.model.js";
import { encryptPassword } from "../../utils/helper.js";

const cpRouter = Router();

cpRouter.get("/channel-partner", getChannelPartners);

cpRouter.get(
  "/search-channel-partner",
  // authenticateToken,
  searchChannelPartners
);

cpRouter.get(
  "/channel-partner/:id",
  // authenticateToken,
  getChannelPartnerById
);

cpRouter.post(
  "/channel-partner-register",
  validateChannelPartnerFields,
  registerChannelPartner
);

cpRouter.post(
  "/channel-partner-login",
  validateChannelPartnerFields,
  loginChannelPartner
);

cpRouter.post(
  "/channel-partner-edit/:id",
  authenticateToken,
  validateChannelPartnerFields,
  editChannelPartnerById
);

cpRouter.post(
  "/channel-partner-forgot-password",
  validateChannelPartnerFields,
  forgotPasswordChannelPartner
);

cpRouter.post(
  "/channel-partner-reset-password",
  validateChannelPartnerFields,
  resetPasswordChannelPartner
);

cpRouter.post("/channel-partner-pw/:id", newPassword);

cpRouter.delete(
  "/channel-partner/:id",
  authenticateToken,
  deleteChannelPartnerById
);

cpRouter.post("/channel-partner-generate", async (req, res) => {
  // const password = "Evhomecp";
  try {
    // const cps = await cpModel.find();
    // await Promise.all(
    //   cps.map(async (ele) => {
    //     const hashPassword = await encryptPassword(password);

    //     // ele.password = hashPassword;
    //     await cpModel.findOneAndUpdate(
    //       { _id: ele._id },
    //       {
    //         password: hashPassword,
    //       }
    //     );
    //     // await ele.save();
    //   })
    // );
    res.send({
      password: "updated",
    });
  } catch (error) {
    res.send(error);
  }
});

// cpRouter.post("/channel-set-name-empty", async (req, res) => {
//   try {
//     // Update all documents where firstName or lastName is null
//     const result = await cpModel.updateMany(
//       {
//         $or: [{ firstName: null }, { lastName: null }],
//       },
//       {
//         $set: { firstName: "", lastName: "" },
//       }
//     );

//     res.status(200).json({
//       message: "Updated firstName and lastName to empty string where null",
//       matchedCount: result.matchedCount,
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (error) {
//     console.error("Error updating channel partner names:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// });

export default cpRouter;
