import contestModel from "../model/contest.model.js";
import { errorRes, successRes } from "../model/response.js";


export const getContest= async (req, res) => {
  try {
    const respDept = await contestModel.find().populate({
      select:"",
      path:"event"
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

export const addContest = async (req, res) => {
  const body = req.body;
  const { firstName, lastName, phoneNumber,photoUrl, event } = body;
console.log("yes");
  try {
    if (!firstName) return res.send(errorRes(403, "first name is required"));
    if (!lastName) return res.send(errorRes(403, "last name is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "phone number is required"));
  //  if(!validTill) return res.send(errorRes(403, "End Date is required"));

    const newContest = await contestModel.create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      photoUrl:photoUrl,
      event: event
    });

    const newPopulatedContest = await newContest.populate({select:"",path:"event"})

    console.log("yes2");
    await newContest.save();

    return res.send(
      successRes(200, `Contest applicant added successfully: ${firstName}${lastName}`, {
        data: newPopulatedContest,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
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