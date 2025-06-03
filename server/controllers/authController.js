// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(404).json({ success: false, error: "Wrong Password" });
    }

    // Generate access and refresh tokens:
    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "15m" } // Access token expires in 15 minutes
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verify = (req, res) => {
  // By this point, authMiddleware has attached req.user
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify };
