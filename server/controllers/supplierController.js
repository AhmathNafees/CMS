import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import multer from "multer"
import path from "path"
import fs from "fs";
import Supplier from "../models/supplierModel.js";

const deleteImage = (folder, filename) => {
  if (!filename) return;

  const filePath = path.resolve(folder, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted previous image: ${filePath}`);
    } catch (err) {
      console.error(`❌ Error deleting file ${filePath}:`, err.message);
    }
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
};


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

//Login for Suppliers
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const supplier = await Supplier.findOne({ email });
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier Not Found" });
    }
    
    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      return res.status(404).json({ success: false, error: "Wrong Password" });
    }

    // Generate access and refresh tokens:
    const accessToken = jwt.sign(
      { _id: supplier._id, role: supplier.role },
      process.env.JWT_KEY,
      { expiresIn: "8h" } // Access token expires in 8h
    );
    const refreshToken = jwt.sign(
      { _id: supplier._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      supplier: { _id: supplier._id, name: supplier.name, role: supplier.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verify = (req, res) => {
  // By this point, authMiddleware has attached req.supplier
  return res.status(200).json({ success: true, supplier: req.supplier });
};

// controllers/supplierController.js or separate controller
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


const addSupplier =async (req, res)=>{

    try{
        const {
            name,email,password,role,nic,dob,
            gender,maritalStatus,pno,
        }=req.body;

        const supplier =await Supplier.findOne({email})
        if(supplier){
            return res.status(400).json({success : false, error:"supplier already Registered "})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newSupplier = new Supplier({
            name,
            pno,
            email,
            password:hashPassword,
            role,
            nic,
            dob,
            gender,
            maritalStatus,
            profileImage: req.file ? req.file.filename : "",
        })
        const savedUser = await newSupplier.save()

        await newSupplier.save()
        return res.status(200).json({success:true, message:"employee created"})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"server error in adding Supplier"})
    }
};

const getSuppliers = async (req, res) => {
  try {
    const userId = req.supplier.id;

    // Get the logged-in supplier
    const supplier = await Supplier.findById(userId);

    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }
    let suppliers;
    suppliers = await Supplier.find()

    return res.status(200).json({ success: true, suppliers });

  } catch (error) {
    console.error("Get Customers Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error in getCustomers" });
  }
};

const getSupplier = async(req,res) =>{
  const {id} = req.params;
  try{
      const supplier = await Supplier.findById({_id:id})
      return res.status(200).json({success:true, supplier})
    }catch(error){
      return res.status(500).json({success: false, error:"Server Error in get Supplier"})
    }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the existing Supplier document
    const supplierDoc = await Supplier.findById(id);
    if (!supplierDoc) {
      return res.status(404).json({ success: false, error: "Supplier Not Found" });
    }
    
    // Extract the Supplier ID from the BranchAdmin document
    const userId = supplierDoc;
    const oldProfileImage = supplierDoc.profileImage; 

    // Build an update object for the Supplier.
    // Here, if a new password is provided, hash it; otherwise, leave it unchanged.
    const updateUserObj = {
      name: req.body.name,
      email: req.body.email,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      maritalStatus: req.body.maritalStatus,
      pno: req.body.pno,
      
    };
    // If file upload is processed by multer, req.file will exist.
    // If a new profileImage file is provided, update the profileImage field.
    if (req.file) {
      // 🗑️ Delete the old profile image from disk if it exists
      deleteImage("public/uploads", oldProfileImage);
      updateUserObj.profileImage = req.file.filename;
    } else if(req.body.profileImage) {
      // Alternatively, if the client sent a profileImage value via FormData
      updateUserObj.profileImage = req.body.profileImage;
    }

    // Update the Supplier document
    const updateSupplier = await Supplier.findByIdAndUpdate(id, updateUserObj, { new: true })

    if (!updateSupplier) {
      return res.status(500).json({ success: false, error: "Document not found" });
    }
    return res.status(200).json({ success: true, message: "Supplier Updated", supplier:updateSupplier });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server Error in Update supplier", details: error.message });
  }
};


const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    // Delete profile image if exists
    if (supplier.profileImage) {
      deleteImage("customers", supplier.profileImage);
    }

    // Delete supplier from database
    await Supplier.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Delete Supplier Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while deleting supplier" });
  }
};


export{addSupplier,upload, getSuppliers, getSupplier,updateSupplier,deleteSupplier,login,verify,refreshSupplierToken}