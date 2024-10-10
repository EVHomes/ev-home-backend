import config from "../config/config.js";
import cpModel from "../model/channelPartner.model.js";
import clientModel from "../model/client.model.js";
import employeeModel from "../model/employee.model.js";
import { errorRes } from "../model/response.js";
import { createJwtToken, verifyJwtToken } from "../utils/helper.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.headers.refreshtoken?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = verifyJwtToken(accessToken, config.SECRET_ACCESS_KEY);
      req.user = decoded.data;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Token has expired, attempt to refresh
        if (!refreshToken) {
          return res.send(errorRes(401, "Refresh token not found"));
        }

        try {
          const decoded = verifyJwtToken(
            refreshToken,
            config.SECRET_REFRESH_KEY
          );
          let user;
          if (decoded.data.role === "channel-partner") {
            user = await cpModel.findById(decoded.data._id);

            if (!user) {
              return res.send(errorRes(401, "Channel Partner not found"));
            }
          } else if (decoded.data.role === "employee") {
            user = await employeeModel.findById(decoded.data._id);

            if (!user) {
              return res.send(errorRes(401, "Channel Partner not found"));
            }
          } else if (decoded.data.role === "customer") {
            user = await clientModel.findById(decoded.data._id);

            if (!user) {
              return res.send(errorRes(401, "Channel Partner not found"));
            }
          }

          if (!user) {
            return res.send(errorRes(401, "No valid Session found"));
          }
          const { password, ...userWithoutPassword } = user;

          const newAccessToken = createJwtToken(
            userWithoutPassword,
            config.SECRET_ACCESS_KEY,
            "15m"
          );

          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          // res.setHeader("NewAccessToken", `Bearer ${newAccessToken}`);
          req.user = {
            ...userWithoutPassword,
          };
          return next();
        } catch (refreshError) {
          return res.send(errorRes(401, "Invalid refresh token"));
        }
      }
      return res.send(errorRes(401, "Invalid token"));
    }
  } catch (error) {
    return res.send(errorRes(401, "Internal server error"));
  }
};
