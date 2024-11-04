import ourProjectModel from "../model/ourProjects.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getOurProjects = async (req, res) => {
  try {
    const respPro = await ourProjectModel.find();
    return res.send(
      successRes(200, "Get our projects", {
        data: respPro,
      })
    );
  } catch (error) {
    return res.json({
      message: `error:${error}`,
    });
  }
};

//GET BY ID
export const getProjectsById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respPro = await divisionModel.findOne({ _id: id });
    if (!respPro)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respPro,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//ADD PROJECTS
export const addProjects = async (req, res) => {
  const body = req.body;

  const {
    amenities,
    configurations,
    contactNumber,
    countryCode,
    description,
    locationLink,
    locationName,
    name,
    brochure,
    showCaseImage,
  } = body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!amenities || amenities.length === 0)
      return res.send(errorRes(403, "Amenities are required"));
    if (!configurations || configurations.length === 0)
      return res.send(errorRes(403, "configurations is required"));
    // if (!contactNumber)
    //   return res.send(errorRes(403, "Contact number is required"));
    // if (!description) return res.send(errorRes(403, "Description is required"));
    // if (!locationLink)
    //   return res.send(errorRes(403, "Location link is required"));
    if (!locationName)
      return res.send(errorRes(403, "Location name is required"));
    if (!name) return res.send(errorRes(403, "Project name is required"));
    if (!showCaseImage)
      return res.send(errorRes(403, "Showcase image is required"));

    // Create a new project
    const newProject = await ourProjectModel.create({ ...body });

    await newProject.save();

    // Send a success response000
    return res.send(
      successRes(200, `Project added successfully: ${(name, locationName)}`, {
        newProject,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

//UPDATE PROJECTS
export const updateProjects = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const {
    amenities,
    bhkConfiguration,
    contactNumber,
    countryCode,
    description,
    locationLink,
    locationName,
    name,
    brochure,
    showCaseImage,
  } = body; // Destructuring the body fields

  try {
    // Validate the necessary fields
    if (!id) return res.send(errorRes(403, "ID is required"));
    if (!body) return res.send(errorRes(403, "Data is required"));
    // if (!amenities || amenities.length === 0)
    //   return res.send(errorRes(403, "Amenities are required"));
    // if (!bhkConfiguration || bhkConfiguration.length === 0)
    //   return res.send(errorRes(403, "BhkList is required"));
    // if (!contactNumber)
    //   return res.send(errorRes(403, "Contact number is required"));
    // if (!description) return res.send(errorRes(403, "Description is required"));
    // if (!locationLink)
    //   return res.send(errorRes(403, "Location link is required"));
    // if (!locationName)
    //   return res.send(errorRes(403, "Location name is required"));
    // if (!name) return res.send(errorRes(403, "Project name is required"));
    // if (!showCaseImage)
    //   return res.send(errorRes(403, "Showcase image is required"));

    // Perform the update

    // console.log(body);
    const updatedProject = await ourProjectModel.findByIdAndUpdate(
      id, // Find by project ID
      { ...body },
      { new: true } // Return the updated document
    );

    if (!updatedProject)
      return res.send(errorRes(404, `Project not found with ID: ${id}`));

    // Send a success response
    return res.send(
      successRes(200, `Project updated successfully: ${name}`, {
        updatedProject,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

//DELETE PROJECTS
export const deleteProject = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "Project ID is required"));
    const deletedProject = await ourProjectModel.findByIdAndDelete(id);
    if (!deletedProject)
      return res.send(errorRes(404, `Project not found with ID: ${id}`));
    return res.send(
      successRes(200, `Project deleted successfully: ${deletedProject.name}`, {
        deletedProject,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const searchProjects = async (req, res, next) => {
  try {
    let query = req.query.query || "";
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;

    let searchFilter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ],
    };

    const respProject = await ourProjectModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .select("");

    // Count the total items matching the filter
    const totalItems = await ourProjectModel.countDocuments(searchFilter);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.send(
      successRes(200, "get Projects", {
        page,
        limit,
        totalPages,
        totalItems,
        items: respProject,
      })
    );
  } catch (error) {
    return next(error);
  }
};
