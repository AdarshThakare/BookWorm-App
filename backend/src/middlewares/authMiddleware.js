import User from "../models/Users.js";

export const protectRoute = async (req, res, next) => {
  //get token
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized bitch! Access D-nied" });
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user
    const user = await User.findById(decoded.userId).select("-password"); //bring everything - passord (we dont need password)

    if (!user) {
      return res.status(401).json({ msg: "Token invalid" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error : ", err.message);
    res.status(401).json({ msg: "Token is invalid" });
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
