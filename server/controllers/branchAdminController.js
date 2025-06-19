import BranchAdmin from "../models/BranchAdminModel.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import branch from "../models/BranchModel.js"
import fs from "fs";

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

const addBranchAdmin =async (req, res)=>{

    try{
        const {
            name,email,password,role,nic,dob,
            gender,maritalStatus,branch,pno,
        }=req.body;

        const user =await User.findOne({email})
        if(user){
            return res.status(400).json({success : false, error:"user already Registered "})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            pno,
            email,
            password:hashPassword,
            role,
            profileImage: req.file ? req.file.filename : "",
        })
        const savedUser = await newUser.save()

        const newBranchAdmin = new BranchAdmin({
            userId: savedUser._id,
            nic,
            dob,
            gender,
            maritalStatus,
            branch,
        })

        await newBranchAdmin.save()
        return res.status(200).json({success:true, message:"employee created"})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"server error in adding branch admin"})
    }
}

const getBranchAdmins = async (req, res) => {
  try {
    // Fetch all BranchAdmin documents with user populated only if role is "admin" or "branchAdmin"
    const branchAdmins = await BranchAdmin.find()
      .populate({
        path: 'userId',
        match: { role: { $in: ['admin', 'branchAdmin'] } }, // only include if role is admin or branchAdmin
        select: '-password' // exclude password
      })
      .populate('branch');

    // Remove any BranchAdmin where the populated userId is null (i.e., role didn't match).
    const filteredAdmins = branchAdmins.filter(admin => admin.userId !== null);

    return res.status(200).json({ success: true, branchAdmins: filteredAdmins });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error in get Branch Admins" });
  }
};

// This is for view function in got value
const getBranchAdmin = async(req,res)=>{
    let branchAdmin;
    const {id} = req.params;
    try{
        const updatedData = req.body;
        branchAdmin = await BranchAdmin.findById({_id:id}).populate('userId',{password:0}).populate('branch') //password 0 means not taken
        if(!branchAdmin){
          const updatedData = req.body;
          branchAdmin = await BranchAdmin.findOne({userId:id}).populate('userId',{password:0}).populate('branch') //password 0 means not taken
        }
        return res.status(200).json({success:true, branchAdmin})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in get Branch Admins"})
    }
}

const updateBranchAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // First, find the existing BranchAdmin document
    const branchAdminDoc = await BranchAdmin.findById(id);
    if (!branchAdminDoc) {
      return res.status(404).json({ success: false, error: "Branch Admin Not Found" });
    }
    
    // Extract the User ID from the BranchAdmin document
    const userId = branchAdminDoc.userId;
    const oldProfileImage = branchAdminDoc.userId.profileImage; // stored in User model

    // Build an update object for the User.
    // Here, if a new password is provided, hash it; otherwise, leave it unchanged.
    const updateUserObj = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      pno: req.body.pno,
      updateAt: Date.now(), // ✅ Manually set updateAt
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

    // Update the User document
    const updatedUser = await User.findByIdAndUpdate(userId, updateUserObj, { new: true });

    // Build an update object for BranchAdmin.
    // Here, we assume that the client sends a branch field (which should be the branch _id)
    const updateAdminObj = {
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      maritalStatus: req.body.maritalStatus,
      branch: req.body.branch, // Use branch _id—not branch_name
      updateAt: Date.now(), // ✅ Manually set updateAt
    };

    // Update the BranchAdmin document
    const updatedAdmin = await BranchAdmin.findByIdAndUpdate(id, updateAdminObj, { new: true })
      .populate("userId", { password: 0 })
      .populate("branch");

    if (!updatedUser || !updatedAdmin) {
      return res.status(500).json({ success: false, error: "Document not found" });
    }
    return res.status(200).json({ success: true, message: "Branch Admin Updated", updatedAdmin });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server Error in Update Branch Admins", details: error.message });
  }
};

const deleteBranchAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Populate userId to access profileImage
    const branchAdminDoc = await BranchAdmin.findById(id).populate("userId");
    if (!branchAdminDoc) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const profileImage = branchAdminDoc.userId?.profileImage;
    const userId = branchAdminDoc.userId._id;

    // Delete BranchAdmin and User
    await BranchAdmin.findByIdAndDelete(id);
    await User.findByIdAndDelete(userId);

    // Delete profile image from disk if it exists
    if (profileImage) {
      const imagePath = path.join(process.cwd(), "public", "uploads", profileImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting profile image file:", err);
        } else {
          console.log(`Profile image ${profileImage} deleted successfully.`);
        }
      });
    }

    return res.status(200).json({ success: true, message: "Branch Admin deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error in deleting Branch Admin" });
  }
};

const getBranchAdminsByBranch = async (req, res) => {
  const { branchId } = req.params;

  try {
    const branchAdmins = await BranchAdmin.find({ branch: branchId })
      .populate("userId", { password: 0 })
      .populate("branch");

    return res.status(200).json({ success: true, branchAdmins });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error fetching branch admins" });
  }
};

//for customercare
const getCustomerCareAdmins = async (req, res) => {
  try {
    const customerCareAdmins = await BranchAdmin.find()
      .populate({
        path: 'userId',
        match: { role: 'customerCare' },  // <-- role is on the User document
        select: '-password',              // <-- exclude password
      })
      .populate('branch');

    // Remove BranchAdmins whose userId didn’t match (null due to failed match)
    const filtered = customerCareAdmins.filter(admin => admin.userId !== null);

    return res.status(200).json({ success: true, branchAdmins: filtered });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error fetching Customer Care admins" });
  }
};


export {addBranchAdmin, upload, getBranchAdmins, getBranchAdmin, updateBranchAdmin, deleteBranchAdmin, getBranchAdminsByBranch, getCustomerCareAdmins}