import BranchAdmin from "../models/BranchAdminModel.js"
import User from "../models/User.js";
import Branch from "../models/BranchModel.js"
import fs from "fs";
import path from "path";
import IndexCustomer from "../models/indexCustomerModel.js";

const deleteImage = (folder, filename) => {
  if (!filename) return;

  const filePath = path.resolve("public", folder, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted old ${folder} image:`, filename);
    } catch (err) {
      console.error(`❌ Error deleting ${filename}:`, err.message);
    }
  } else {
    console.warn(`⚠️ File not found to delete: ${filePath}`);
  }
};


//Add Inedx Customer
const addIndexCustomer = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const branchAdmin = await BranchAdmin.findOne({ userId }).populate("branch");

    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const {
      name, pno,location, gender,desc
    } = req.body;
    // Multer handles multiple files via req.files when using upload.fields
    const profileImage = req.files?.profileImage?.[0]?.filename  || "";
    const passportImage = req.files?.passportImage?.[0]?.filename  || "";
    //  console.log("Uploaded Files:", req.files);
    const newIndexCustomer = new IndexCustomer({
      name,
      pno,
      location,
      gender,
      profileImage,
      passportImage,
      userId,
      branchId: branchAdmin.branch._id,
      desc,
    });
    // console.log("Uploaded Files:", req.files);
    await newIndexCustomer.save();
    return res.status(201).json({ success: true, message: "Index Customer added successfully" });
  } catch (error) {
    console.error("Add Index Customer Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// for see all customers
const getIndexCustomers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let indexCustomers;

    if (user.role === "admin") {
      // ✅ Main Admin sees all customers
      indexCustomers = await IndexCustomer.find()
        .populate("userId", { password: 0 })
        .populate("branchId");

    } else if (user.role === "customerCare") {
      // ✅ Branch Admin sees only their branch's customers
      const branchAdmin = await BranchAdmin.findOne({ userId });

      if (!branchAdmin) {
        return res.status(404).json({ success: false, error: "Branch Admin not found" });
      }

      indexCustomers = await IndexCustomer.find({ branchId: branchAdmin.branch })
        .populate("userId", { password: 0 })
        .populate("branchId");

    } else {
      return res.status(403).json({ success: false, error: "Unauthorized role" });
    }

    return res.status(200).json({ success: true, indexCustomers });

  } catch (error) {
    console.error("Get Customers Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error in getIndexCustomers" });
  }
};


// for single coustomer view
const getIndexCustomer = async(req,res) =>{
  const {id} = req.params;
  try{
      const indexCustomer = await IndexCustomer.findById({_id:id}).populate('userId',{password:0}).populate('branchId') //password 0 means not taken
      return res.status(200).json({success:true, indexCustomer})
    }catch(error){
      return res.status(500).json({success: false, error:"Server Error in get indexCustomer"})
    }
}

const editIndexCustomer = async (req, res) => {
  try {
    const { id } = req.params; // customer ID
    const userId = req.user.id; // authenticated branch admin user ID

    // Check branch admin
    const branchAdmin = await BranchAdmin.findOne({ userId });
    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    // Fetch existing customer to get old image filenames
    const indexCustomer = await IndexCustomer.findById(id);
    if (!indexCustomer) {
      return res.status(404).json({ success: false, error: "Index Customer not found" });
    }

    // Extract fields from request
    const {
      name, pno,location,gender,desc
    } = req.body;

    const updatedFields = {
      name,
      pno,
      location,
      gender,
      desc,
      userId,
      branchId: branchAdmin.branch,
    };

    // Handle profile image update
    if (req.files?.profileImage?.[0]) {
      deleteImage("indexCustomers", indexCustomer.profileImage); // delete old image
      updatedFields.profileImage = req.files.profileImage[0].filename;
    }

    // Handle passport image update
    if (req.files?.passportImage?.[0]) {
      deleteImage("indexCustomerCV", indexCustomer.passportImage); // delete old passport
      updatedFields.passportImage = req.files.passportImage[0].filename;
    }

    // Update the customer in DB
    const updatedCustomer = await IndexCustomer.findByIdAndUpdate(id, updatedFields, { new: true });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      updatedCustomer
    });

  } catch (error) {
    console.error("Edit Customer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while updating Index customer" });
  }
};

const deleteIndexCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const indexCustomer = await IndexCustomer.findById(id);
    if (!indexCustomer) {
      return res.status(404).json({ success: false, error: "indexCustomer not found" });
    }

    // Delete profile image if exists
    if (indexCustomer.profileImage) {
      deleteImage("indexCustomers", indexCustomer.profileImage);
    }

    // Delete passport image if exists
    if (indexCustomer.passportImage) {
      deleteImage("indexCustomerCV", indexCustomer.passportImage);
    }

    // Delete customer from database
    await IndexCustomer.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "indexCustomer deleted successfully" });
  } catch (error) {
    console.error("Delete indexCustomer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while deleting indexCustomer" });
  }
};
//for Main Admin
const getIndexCustomersByBranchAdmin = async (req, res) => {
  try {
    const { branchAdminId } = req.params;
    const branchAdmin = await BranchAdmin.findById(branchAdminId);

    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const indexCustomers = await IndexCustomer.find({ userId: branchAdmin.userId })
      .populate("userId", { password: 0 })
      .populate("branchId");

    return res.status(200).json({ success: true, indexCustomers });

  } catch (error) {
    console.error("Error fetching customers by branch admin:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
const getIndexCustomersByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(404).json({ success: false, error: "Branch  not found" });
    }

    const indexCustomers = await IndexCustomer.find({ branchId})
      .populate("userId", { password: 0 })
      .populate("branchId");

    return res.status(200).json({ success: true, indexCustomers });

  } catch (error) {
    console.error("Error fetching customers by branch admin:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



export {addIndexCustomer, getIndexCustomers, getIndexCustomer, editIndexCustomer, deleteIndexCustomer, getIndexCustomersByBranchAdmin, getIndexCustomersByBranch}