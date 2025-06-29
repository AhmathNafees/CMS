import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import Supplier from "../models/supplierModel.js";

// 🔧 Utility function to delete old images
const deleteImage = (folder, filename) => {
  if (!filename) return;

  const filePath = path.resolve(folder, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted image: ${filePath}`);
    } catch (err) {
      console.error(`❌ Error deleting file ${filePath}:`, err.message);
    }
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
};

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ✅ Supplier Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier Not Found" });
    }

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong Password" });
    }

    const accessToken = jwt.sign(
      { _id: supplier._id, role: supplier.role },
      process.env.JWT_KEY,
      { expiresIn: "8h" }
    );
    const refreshToken = jwt.sign(
      { _id: supplier._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      supplier: {
        _id: supplier._id,
        name: supplier.name,
        role: supplier.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Verify Login
const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

// ✅ Refresh Token
const refreshSupplierToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const supplier = await Supplier.findById(decoded._id).select("-password");
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    const newAccessToken = jwt.sign(
      { _id: supplier._id, role: supplier.role },
      process.env.JWT_KEY,
      { expiresIn: "8h" }
    );
    const newRefreshToken = jwt.sign(
      { _id: supplier._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Add Supplier
const addSupplier = async (req, res) => {
  try {
    const { name, email, password, role, nic, dob, gender, maritalStatus, pno } = req.body;

    const existing = await Supplier.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: "Supplier already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSupplier = new Supplier({
      name,
      email,
      password: hashedPassword,
      role,
      nic,
      dob,
      gender,
      maritalStatus,
      pno,
      profileImage: req.file ? req.file.filename : ""
    });

    await newSupplier.save();
    return res.status(200).json({ success: true, message: "Supplier created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error creating supplier" });
  }
};

// ✅ Get All Suppliers (Admin only)
const getSuppliers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Unauthorized access" });
    }

    const suppliers = await Supplier.find();
    return res.status(200).json({ success: true, suppliers });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error fetching suppliers" });
  }
};

// ✅ Get Supplier by ID
const getSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }
    return res.status(200).json({ success: true, supplier });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error fetching supplier" });
  }
};

// ✅ Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierDoc = await Supplier.findById(id);
    if (!supplierDoc) {
      return res.status(404).json({ success: false, error: "Supplier Not Found" });
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      maritalStatus: req.body.maritalStatus,
      pno: req.body.pno
    };

    if (req.file) {
      deleteImage("public/uploads", supplierDoc.profileImage);
      updateData.profileImage = req.file.filename;
    } else if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
    }

    const updated = await Supplier.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({ success: true, message: "Supplier Updated", supplier: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error updating supplier" });
  }
};

// ✅ Delete Supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    if (supplier.profileImage) {
      deleteImage("public/uploads", supplier.profileImage);
    }

    await Supplier.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error deleting supplier" });
  }
};

export {
  addSupplier,
  upload,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  login,
  verify,
  refreshSupplierToken
};
