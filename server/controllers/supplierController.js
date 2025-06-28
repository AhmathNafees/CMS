import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import fs from "fs";
import Supplier from "../models/supplierModel.js";
import User from "../models/User.js";

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

const addSupplier =async (req, res)=>{

    try{
        const {
            name,email,password,role,nic,dob,
            gender,maritalStatus,pno,
        }=req.body;

        const user =await Supplier.findOne({email})
        if(user){
            return res.status(400).json({success : false, error:"user already Registered "})
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
    const userId = req.user.id;

    // Get the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
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
    
    // Extract the User ID from the BranchAdmin document
    const userId = supplierDoc;
    const oldProfileImage = supplierDoc.profileImage; 

    // Build an update object for the User.
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


export{addSupplier,upload, getSuppliers, getSupplier,updateSupplier}