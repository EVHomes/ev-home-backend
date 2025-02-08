import demandModel from "../model/demand.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getDemand = async (req, res) => {
  try {
    const respDemand = await demandModel
      .find()
      .populate({
        path: "project",
      })
      .populate({
        path: "reminders.customer",
      });

    return res.send(
      successRes(200, "Get Demand Details", {
        data: respDemand,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addDemand = async (req, res) => {
  try {
    if (!req.body) return res.send(errorRes(401, "data Required"));

    const respDemand = await demandModel.create({ ...req.body });

    return res.send(
      successRes(200, "new Demand Added", {
        data: respDemand,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

// import demandModel from "../model/demand.model.js";
// import { errorRes, successRes } from "../model/response.js";

// export const getDemand = async (req, res) => {
//   try {
//     const respDemand = await demandModel
//       .find()
//       .populate({
//         path: "project",
//       })
//       .populate({
//         path: "reminders.customer",
//       });

//     return res.send(
//       successRes(200, "Get Demand Details", {
//         data: respDemand,
//       })
//     );
//   } catch (error) {
//     return res.send(errorRes(500, error));
//   }
// };

// export const addDemand = async (req, res) => {
//   try {
//     if (!req.body) return res.send(errorRes(401, "data Required"));

//     const respDemand = await demandModel.create({ ...req.body });

//     return res.send(
//       successRes(200, "new Demand Added", {
//         data: respDemand,
//       })
//     );
//   } catch (error) {
//     return res.send(errorRes(500, error));
//   }
// };
