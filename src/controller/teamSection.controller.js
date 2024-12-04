import { errorRes, successRes } from "../model/response.js";
import teamSectionModel from "../model/teamSections.model.js";

//GET BY ALL
export const getTeamSections = async (req, res) => {
  try {
    const respSections = await teamSectionModel.find().populate("designations");
    return res.send(
      successRes(200, "Get team Sections", {
        data: respSections,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};


export const addTeamSection = async (req, res) => {
  const { section, designations } = req.body;
  try {
    if (!section) return res.send(errorRes(401, "Section is required"));

    if (!designations)
      return res.send(errorRes(401, "Desginations List is required"));

    const respSection = await teamSectionModel.find({
      section: section,
    });

    if (respSection)
      return res.send(errorRes(401, "Team Section Already Exist"));

    const newDesgId = section?.replace(/\s+/g, "-") + "team".toLowerCase();

    const newSection = await teamSectionModel.create({
      _id: newDesgId,
      section: section,
      designations: designations,
    });
    const respFound = await teamSectionModel
      .findById(newSection?._id)
      .populate("designations");

    return res.send(
      successRes(200, "New Section added", {
        data: respFound,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const getTeamSectionById = async (req, res) => {
  try {
    const respSections = await teamSectionModel.find().populate("designations");
    return res.send(
      successRes(200, "Get team Sections", {
        data: respSections,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};
