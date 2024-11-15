import contestModel from "../model/contest.model.js";
import { errorRes, successRes } from "../model/response.js";


export const addContest = async (req, res) => {
  const body = req.body;
  const { firstName, lastName, dateOfRegister, phoneNumber } = body;

  try {
    if (!firstName) return res.send(errorRes(403, "first name is required"));
    if (!lastName) return res.send(errorRes(403, "last name is required"));
    if (!dateOfRegister) return res.send(errorRes(403, "date is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "phone number is required"));

    const newContest = await contestModel.create({
      firstName: firstName,
      lastName: lastName,
      dateOfRegister: dateOfRegister,
      phoneNumber: phoneNumber,
    });
    await newContest.save();

    return res.send(
      successRes(200, `Contest applicant added successfully: ${firstName}${lastName}`, {
        data: newContest,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};
