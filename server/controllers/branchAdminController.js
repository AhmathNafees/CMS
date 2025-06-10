import BranchAdmin from "../models/BranchAdminModel.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import branch from "../models/BranchModel.js"


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
            gender,maritalStatus,branch,
        }=req.body;

        const user =await User.findOne({email})
        if(user){
            return res.status(400).json({success : false, error:"user already Registered "})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
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

const getBranchAdmins = async(req,res)=>{
    try{
        const branchAdmins = await BranchAdmin.find().populate('userId',{password:0}).populate('branch') //password 0 means not taken
        return res.status(200).json({success:true, branchAdmins})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in get Branch Admins"})
    }
}
// This is for edit function in got value
const getBranchAdmin = async(req,res)=>{
    const {id} = req.params;
    try{
        const updatedData = req.body;
        const branchAdmin = await BranchAdmin.findById({_id:id}).populate('userId',{password:0}).populate('branch') //password 0 means not taken
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

    // Build an update object for the User.
    // Here, if a new password is provided, hash it; otherwise, leave it unchanged.
    const updateUserObj = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    // If file upload is processed by multer, req.file will exist.
    // If a new profileImage file is provided, update the profileImage field.
    if (req.file) {
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
    // Find the BranchAdmin document by id
    const branchAdminDoc = await BranchAdmin.findById(id);
    if (!branchAdminDoc) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }
    
    // Optionally, if you want to delete the associated user record as well,
    // extract userId from the branch admin document.
    const userId = branchAdminDoc.userId;
    
    // Delete the BranchAdmin document
    await BranchAdmin.findByIdAndDelete(id);
    
    // Optionally, delete the associated user document. Remove this block if you wish to keep the user record.
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "Branch Admin deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error in deleting Branch Admin" });
  }
};


export {addBranchAdmin, upload, getBranchAdmins, getBranchAdmin, updateBranchAdmin, deleteBranchAdmin}