import { longFormatters } from "date-fns";
import geofenceModel from "../model/geofence.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getGeofence = async (req, res) => {
  try {
    const respGeo = await geofenceModel.find();
    return res.send(
      successRes(200, "Get geofence", {
        data: respGeo,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

//GET BY ID
// export const getGeofenceById = async (req, res) => {
//     const id = req.params.id;
//     try {
//       if (!id) return res.send(errorRes(403, "id is required"));
  
//       const respGeo = await geofenceModel.findById(id);
  
//       if (!respGeo) return res.send(errorRes(404, `Department not found`));
  
//       return res.send(
//         successRes(200, `Department Found`, {
//           data: respGeo,
//         })
//       );
//     } catch (error) {
//       return res.send(errorRes(500, error));
//     }
//   };
  
  //add division
  export const addGeofence = async (req, res) => {
    const body = req.body;

    const {
        address, name, latitude, longitude, radius, status, locationLink } = body;
  
    try {
     
      if (!body) return res.send(errorRes(403, "geofence is required"));
    //   const newGeoId = "geo-" + geofence?.replace(/\s+/g, "-").toLowerCase();
  
      const newGeofence = await geofenceModel.create({
       ...body
        
      });
      await newGeofence.save();
  
      return res.send(
        successRes(200, `geofence added successfully: ${body}`, {
          data: newGeofence,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };

   //DELETE PROJECTS
export const deleteGeofence = async (req, res) => {
    const id = req.params.id;
  
    try {
      if (!id) return res.send(errorRes(403, "Geofence ID is required"));
      const deleteGeofence = await geofenceModel.findByIdAndDelete(id);
      if (!deleteGeofence)
        return res.send(errorRes(404, `Project not found with ID: ${id}`));
      return res.send(
        successRes(200, `Project deleted successfully: ${deleteGeofence.name}`, {
          deleteGeofence,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, `Server error: ${error?.message}`));
    }
  };