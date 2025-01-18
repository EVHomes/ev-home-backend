import clientModel from "../model/client.model.js";
import contestModel from "../model/contest.model.js";
import { errorRes, successRes } from "../model/response.js";
import { encryptPassword } from "../utils/helper.js";

export const getContest = async (req, res) => {
  try {
    const respDept = await contestModel.find().populate({
      select: "",
      path: "event",
    });

    return res.send(
      successRes(200, "Get Contest Applicants", {
        data: respDept,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const getContestById = async (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  try {
    // if (!id) return res.send(errorRes(403, "phoneNumber is required"));
    const respContest = await contestModel.find({$or:[{phoneNumber}, {email}]}).populate({
      select: "",
      path: "event",
    });

    if (!respContest) return errorRes(404, "No data found");   

    return res.send(
      successRes(200, "Similar Leads", {
        data: respContest,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addContest = async (req, res) => {
  const body = req.body;

  const { firstName, lastName, phoneNumber, email, photoUrl, thumbnail, event } = body;

  console.log("Received Data:", body);

  try {
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!phoneNumber) return res.send(errorRes(403, "Phone number is required"));

    const newContest = await contestModel.create(body);

    if (email) {
      const hashPassword = await encryptPassword(phoneNumber?.toString() ?? "123456");

      const newClient = new clientModel({
        ...body,
        password: hashPassword,
      });
      await newClient.save();
    }

    const newPopulatedContest = await contestModel.findById(newContest.id).populate("event");

    return res.send(
      successRes(200, `Contest applicant added successfully: ${firstName} ${lastName}`, {
        data: newPopulatedContest,
      })
    );
  } catch (error) {
    console.error("Error adding contest:", error);
    return res.send(errorRes(500, error.message || "Server error"));
  }
};


// export const generateContestOtp = async (req, res, next) => {
//   const {firstName, lastName, phoneNumber} = req.body;
//   try {
//     const user = await contestModel.findById(phoneNumber);

//     const findOldOtp = await otpModel.findOne({
//       $or: [{ phoneNumber: phoneNumber }],
//     });
//     if (findOldOtp) {
//       let url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}&project=${project}&closingManager=${user?.firstName} ${user?.lastName}&otp=${findOldOtp.otp}`;
//       // console.log(encodeURIComponent(url));
//       const resp = await axios.post(url);
//       return res.send(
//         successRes(200, "otp Sent to Client", {
//           data: findOldOtp,
//         })
//       );
//     }
//     const newOtp = generateOTP(4);
//     const newOtpModel = new otpModel({
//       otp: newOtp,
//       docId: user?._id,
//       phoneNumber: phoneNumber,
//       type: "contest-entry",
//       message: "Contest Verification Code",
//     });

//     const savedOtp = await newOtpModel.save();

//     let url = `https://hooks.zapier.com/hooks/catch/9993809/25xnarr?phoneNumber=+91${phoneNumber}&name=${firstName} ${lastName}}&otp=${newOtp}`;
//     // console.log(encodeURIComponent(url));
//     const resp = await axios.post(url);
//     return res.send(
//       successRes(200, "otp Sent to Client", {
//         data: savedOtp,
//       })
//     );
//   } catch (error) {
//     return next(error);
//   }
// };
