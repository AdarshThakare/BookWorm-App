import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const protectRoute = async (req, res, next) => {
  //get token
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Access D-nied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Token expired" });
      }
      throw error;
    }
  } catch (err) {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // remove in production!
    console.log("Error in protectRoute middleware", err.message);
    console.error("Authentication error : ", err.message);
  }

  //   const token = req.headers.authorization?.split(" ")[1];
  //   if (!token) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = decoded;
  //     next();
  //   } catch (error) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
};
