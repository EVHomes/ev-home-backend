import upcomingModel from "../model/upcoming_projects.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getupcomingProjects = async (req, res) => {
    try {
      const respPro = await upcomingModel.find();
      return res.send(
        successRes(200, "Get upcoming projects", {
          data: respPro,
        })
      );
    } catch (error) {
        return res.send(errorRes(500, `Server error: ${error?.message}`));
     
    }
  };
  
  export const addupcomingProjects = async (req, res) => {
    const body = req.body;
  
    const {
     name,
     location,
     showcaseimage,
     image,
    } = body;
  
    try {
      if (!body) return res.send(errorRes(403, "Data is required"));
     
      
      // Create a new project
      const newProject = await upcomingModel.create({ ...body });
  
      await newProject.save();
  
      // Send a success response000
      return res.send(
        successRes(200, `Project added successfully: ${(name, location)}`, {
          data : newProject,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, `Server error: ${error?.message}`));
    }
  };