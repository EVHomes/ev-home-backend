import { errorRes, successRes } from "../model/response.js";
import whatsnewModel from "../model/whats_new_model.js";

export const getWhatsNew = async (req, res) => {
  try {
    const respWhats = await whatsnewModel.find();

    return res.send(
      successRes(200, "Get what's new section", {
        data: respWhats,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addWhatsNew = async (req, res) => {
  const body = req.body;
  const { showCaseImage, imageName } = body;
  try {
    if (!showCaseImage) return res.send(errorRes(400, "Body is required"));

    const newWhatsNew = await whatsnewModel.create({
     ...body
    });
    await newWhatsNew.save();

    return res.send(
      successRes(200, `Whats new images added successfully`, {
        data: newWhatsNew,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

// export const addWhatsNew=async(req,res)=>{
//     const body = req.body;
//     const {showCaseImage } = body;
  
//     try {
//       if (!showCaseImage)
//         return res.send(errorRes(403, "show case image is required"));
  
//       const newContest = await contestModel.create({
//        showCaseImage:showCaseImage
//       });
//       await newContest.save();
  
//       return res.send(
//         successRes(200, `Contest applicant added successfu`, {
//           data: newContest,
//         })
//       );
//     } catch (error) {
//       return res.send(errorRes(500, error));
//     }

// };
