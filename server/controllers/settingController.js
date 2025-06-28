import Supplier from "../models/supplierModel.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Try finding as User first
    let account = await User.findById(userId);
    let model = 'User';

    if (!account) {
      account = await Supplier.findById(userId);
      model = 'Supplier';
    }

    if (!account) {
      return res.status(404).json({ success: false, error: "Account not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (model === 'User') {
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
    } else {
      await Supplier.findByIdAndUpdate(userId, { password: hashedPassword });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Password change error" });
  }
};

export { changePassword };
