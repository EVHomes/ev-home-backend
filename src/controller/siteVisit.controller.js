import siteVisitModel from "../model/siteVisitForm.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getSiteVisits = async (req, res) => {
  try {
    const respSite = await siteVisitModel.find();

    return res.send(
      successRes(200, "Get Clients", {
        data: respSite,
      })
    );
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};

export const getSiteVisitsById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respSite = await siteVisitModel.findOne({ _id: id });

    if (!respSite)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respSite,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

export const addSiteVisits = async (req, res) => {
  const body = req.body;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    residence,
    projects,
    choiceApt,
    source,
    closingManager,
    teamLeader,
    team,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!residence) return res.send(errorRes(403, "Residence is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!projects) return res.send(errorRes(403, "Project is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
    if (!source) res.send(errorRes(403, "Source is required"));
    if (!closingManager) res.send(errorRes(403, "Closing Manager is required"));
    if (!choiceApt)
      return res.send(errorRes(403, "Choice of Apartment is required"));
    if (!teamLeader) res.send(errorRes(403, "Team Leader is required"));
    if(!team)res.send(errorRes(403,"Team is required"));

    const newSiteVisit = await siteVisitModel.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      residence,
      projects,
      choiceApt,
      source,
      closingManager:"6706217f765622c7ffb1793f",
      teamLeader:"6706217f765622c7ffb1793f",
      team:"6706217f765622c7ffb1793f"
    });

    await newSiteVisit.save();
    return res.send(
      successRes(200, `Client added successfully: ${firstName} ${lastName}`, {
        newSiteVisit,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};
