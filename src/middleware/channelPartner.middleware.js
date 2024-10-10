import { errorRes } from "../model/response.js";
// Define the allowed fields for designation updates
const ALLOWED_CP_FIELDS = [
  "id",
  "firstName",
  "lastName",
  "dateOfBirth",
  "firmName",
  "homeAddress",
  "firmAddress",
  "countryCode",
  "email",
  "gender",
  "phoneNumber",
  "password",
  "haveReraRegistration",
  "reraCertificate",
  "reraNumber",
  "sameAdress",
  "created_at",
  "isVerified",
  "logo",
  "otp",
];

// Middleware to validate and filter fields
export const validateChannelPartnerFields = (req, res, next) => {
  const filteredBody = {};
  let hasValidFields = false;

  for (const field of ALLOWED_CP_FIELDS) {
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

export const validateRegisterCPFields = (body) => {
  const {
    firstName,
    lastName,
    email,
    firmName,
    phoneNumber,
    haveReraRegistration,
    reraNumber,
    reraCertificate,
  } = body;

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

  if (!firmName) {
    return res.send(
      errorRes(400, {
        message: "Firm Name is required",
      })
    );
  }

  if (haveReraRegistration == true) {
    if (!reraNumber)
      return res.send(
        errorRes(400, {
          message: "email is required",
        })
      );

    if (!reraCertificate)
      return res.send(
        errorRes(400, {
          message: "email is required",
        })
      );
  }

  return true;
};

// export const authenticateTokenCp = async (req, res, next) => {
//   try {
//     const accessToken = req.headers.authorization?.split(" ")[1];
//     const refreshToken = req.headers.refreshtoken?.split(" ")[1];

//     if (!accessToken) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     try {
//       const decoded = jwt.verify(accessToken, config.SECRET_ACCESS_KEY);
//       req.user = decoded.data;
//       return next();
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         // Token has expired, attempt to refresh
//         if (!refreshToken) {
//           return res.send(errorRes(401, "Refresh token not found"));
//         }

//         try {
//           const decoded = jwt.verify(refreshToken, config.SECRET_REFRESH_KEY);
//           const user = await cpModel.findById(decoded.data._id);

//           if (!user) {
//             return res.send(errorRes(401, "Channel Partner not found"));
//           }
//           const { password, ...userWithoutPassword } = user;
//           const newAccessToken = createJwtToken(
//             userWithoutPassword,
//             process.env.ACCESS_TOKEN_SECRET,
//             "15m"
//           );

//           res.setHeader("Authorization", `Bearer ${newAccessToken}`);
//           // res.setHeader("NewAccessToken", `Bearer ${newAccessToken}`);
//           req.user = {
//             ...userWithoutPassword,
//           };
//           return next();
//         } catch (refreshError) {
//           return res.status(401).json({ message: "Invalid refresh token" });
//         }
//       }
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user= user;
//     next();
//   });
// };
