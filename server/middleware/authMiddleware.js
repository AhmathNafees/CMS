import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Supplier from '../models/supplierModel.js';

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ success: false, error: "Token Not Provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      // Check specific JWT error types
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, error: "Token has expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, error: "Token is malformed or invalid" });
      } else if (err.name === "NotBeforeError") {
        return res.status(401).json({ success: false, error: "Token not active yet" });
      } else {
        return res.status(401).json({ success: false, error: "Token Not Valid" });
      }
    }
    // Find user and attach to request
    const user = await User.findById(decoded._id).select("-password");
    const supplier = await Supplier.findById(decoded._id).select("-password");
    if (!user && !supplier) {
      return res.status(404).json({ success: false, error: "User/Supplier Not Found" });
    }

    req.user = user;
    req.supplier=supplier;
    next(); // Go to next middleware or route handler

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export default verifyUser;
