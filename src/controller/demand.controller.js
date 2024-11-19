import demandModel from "../model/demand.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getDemand = async (req, res) => {
    try {
      const respDemand = await demandModel.find();
  
      return res.send(
        successRes(200, "Get Demand Details", {
          data: respDemand,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };
  

//   export const addDemand = async (req, res, next) => {
//     const body = req.body;
//     const {
//         project,
//         floor,
//         flatNo,
//         reminder
//     } = body;
//     try {
//       if (!body) return res.send(errorRes(401, "No Data Provided"));
//       // console.log(body);
//       if (body.applicants == null && body.applicants.length < 0)
//         return res.send(errorRes(401, "Aplicant cant be empty"));
  
//       // const resp = await postSaleLeadModel.find();
//       const resp = await demandModel.create({
//         ...body,
//       });
  
//       // const newLead = postSaleLeadModel.findById(resp._id);
  
//       // .populate({
//       //   path: "closingManager",
//       //   select: "-password -refreshToken",
//       //   populate: [
//       //     { path: "designation" },
//       //     { path: "department" },
//       //     { path: "division" },
//       //     {
//       //       path: "reportingTo",
//       //       populate: [
//       //         { path: "designation" },
//       //         { path: "department" },
//       //         { path: "division" },
//       //       ],
//       //     },
//       //   ],
//       // });
  
//       return res.send(
//         successRes(200, "add post sale leads", {
//           data: resp,
//         })
//       );
//     } catch (error) {
//       return next(error);
//     }
//   };

