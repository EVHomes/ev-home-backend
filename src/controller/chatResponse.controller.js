import ChatResponseModel from "../model/chatResponse.model.js";
import { errorRes, successRes } from "../model/response.js";
import ourProjectModel from "../model/ourProjects.model.js";

export const getDefaultOptionChatOptions = async (req, res) => {
  try {
    const resp = await ChatResponseModel.findOne({ id: "default" });

    return res.send(successRes(200, "chat option", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const addChatOptions = async (req, res) => {
  const { id, message, response, options, email, phoneNumber, type } = req.body;
  try {
    if (!id) return res.send(errorRes(401, "id is required"));
    if (!message) return res.send(errorRes(401, "message is required"));
    if (!type) return res.send(errorRes(401, "type is required"));

    const resp = await ChatResponseModel.create({
      ...req.body,
    });

    return res.send(successRes(200, "chat option", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};

export const getDetails = async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.send(errorRes(400, "Message is required"));
    }

    if (message.includes("Ask about projects")) {
      // Fetch projects from the database
      let opt={};
      const projects = await ourProjectModel.find({}, { name: 1, _id: 1 }); // Include _id to get the project ID
      console.log(projects);

      // Map the projects to include both name and id in the desired format
      const projectOptions = projects.map(project => ({
        message:project.name,
        response:{
          id: project._id, // Use _id as the project ID and convert to string
          message: "Checkout", // Project name
          type: "project" // Set the type to "project"
        }
      }));
      opt.isBot = true;
      opt.message = "We have several exciting projects. Which one would you like to know more about?";
      opt.options= projectOptions;

      // Return the response with options inside data
      return res.send(successRes(200, "List of projects", { 
        data: opt
      }));
    } else {
      return res.send(successRes(200, "Default response", { data: "Your query did not match any specific action." }));
    }
  } catch (error) {
    return res.send(errorRes(500, `${error}`));
  }
};