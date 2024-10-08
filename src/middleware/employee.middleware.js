import config from "../config/config.js";
import cpModel from "../model/channelPartner.model.js";
import { errorRes } from "../model/response.js";
import { createJwtToken } from "../utils/helper.js";
import jwt from "jsonwebtoken";
// Define the allowed fields for designation updates
const ALLOWED_EMPLOYEE_FIELDS = [
  "id",
  "email",
  "employeeId",
  "password",
  "firstName",
  "lastName",
  "gender",
  "dateOfBirth",
  "address",
  "department",
  "designation",
  "division",
  "reportingTo",
  "countryCode",
  "phoneNumber",
  "isVerified",
  "refreshToken",
];

// Middleware to validate and filter fields
export const validateEmployeeFields = (req, res, next) => {
  const filteredBody = {};
  let hasValidFields = false;

  for (const field of ALLOWED_EMPLOYEE_FIELDS) {
    if (field in req.body && req.body[field] != null) {
      filteredBody[field] = req.body[field];
      hasValidFields = true;
    }
  }

  if (!hasValidFields) {
    return res.send(
      errorRes(400, {
        message: "No valid fields to found",
      })
    );
  }
  // const validateResp = validateAllFieldsExist(filteredBody, req, res);
  // if (validateResp == false) return;
  // Attach the filtered body to the request object
  req.filteredBody = filteredBody;
  next();
};

export const validateRegisterEmployeeFields = (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    employeeId,
    designation,
    department,
    division,
    password,
    gender,
    phoneNumber,
    dateOfBirth,
    address,
    isVerified,
  } = req.filteredBody;

  if (!firstName) {
    return res.send(
      errorRes(400, {
        message: "First name is required",
      })
    );
  }

  if (!lastName) {
    return res.send(
      errorRes(400, {
        message: "last name is required",
      })
    );
  }

  if (!phoneNumber) {
    return res.send(
      errorRes(400, {
        message: "phone number is required",
      })
    );
  }

  if (!email) {
    return res.send(
      errorRes(400, {
        message: "email is required",
      })
    );
  }

  if (!employeeId) {
    return res.send(
      errorRes(400, {
        message: "EmployeeId is required",
      })
    );
  }

  if (!gender) {
    return res.send(
      errorRes(400, {
        message: "gender is required",
      })
    );
  }

  if (!designation) {
    return res.send(
      errorRes(400, {
        message: "designation is required",
      })
    );
  }

  if (!department) {
    return res.send(
      errorRes(400, {
        message: "department is required",
      })
    );
  }

  if (!division) {
    return res.send(
      errorRes(400, {
        message: "division is required",
      })
    );
  }

  if (!dateOfBirth) {
    return res.send(
      errorRes(400, {
        message: "date Of Birth is required",
      })
    );
  }
  if (!address) {
    return res.send(
      errorRes(400, {
        message: "address is required",
      })
    );
  }

  return next();
};

export const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.headers.refreshtoken?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.data;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Token has expired, attempt to refresh
        if (!refreshToken) {
          return res.send(errorRes(401, "Refresh token not found"));
        }

        try {
          const decoded = jwt.verify(refreshToken, config.SECRET_REFRESH_KEY);
          const user = await cpModel.findById(decoded.data._id);

          if (!user) {
            return res.send(errorRes(401, "User not found"));
          }
          const { password, ...userWithoutPassword } = user;
          const newAccessToken = createJwtToken(
            userWithoutPassword,
            process.env.ACCESS_TOKEN_SECRET,
            "15m"
          );

          res.setHeader("Authorization", `Bearer ${newAccessToken}`);
          req.user = {
            ...userWithoutPassword,
          };
          return next();
        } catch (refreshError) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };
