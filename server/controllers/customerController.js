import BranchAdmin from "../models/BranchAdminModel.js"
import Customer from "../models/customerModel.js"
import User from "../models/User.js";
import Branch from "../models/BranchModel.js"
import fs from "fs";
import path from "path";

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





const addCustomer = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const branchAdmin = await BranchAdmin.findOne({ userId }).populate("branch");

    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const {
      name, pno, email, homeAdd, nic, dob, gender, maritalStatus,desc,passport
    } = req.body;
    // Multer handles multiple files via req.files when using upload.fields
    const profileImage = req.files?.profileImage?.[0]?.filename  || "";
    const passportImage = req.files?.passportImage?.[0]?.filename  || "";
    //  console.log("Uploaded Files:", req.files);
    const newCustomer = new Customer({
      name,
      pno,
      email,
      homeAdd,
      nic,
      dob,
      gender,
      maritalStatus,
      profileImage,
      passportImage,
      userId,
      branchId: branchAdmin.branch._id,
      passport, 
      desc,
    });
    // console.log("Uploaded Files:", req.files);
    await newCustomer.save();
    return res.status(201).json({ success: true, message: "Customer added successfully" });
  } catch (error) {
    console.error("Add Customer Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// for see all customers
const getCustomers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let customers;

    if (user.role === "admin") {
      // ✅ Main Admin sees all customers
      customers = await Customer.find()
        .populate("userId", { password: 0 })
        .populate("branchId");

    } else if (user.role === "branchAdmin") {
      // ✅ Branch Admin sees only their branch's customers
      const branchAdmin = await BranchAdmin.findOne({ userId });

      if (!branchAdmin) {
        return res.status(404).json({ success: false, error: "Branch Admin not found" });
      }

      customers = await Customer.find({ branchId: branchAdmin.branch })
        .populate("userId", { password: 0 })
        .populate("branchId");

    } else {
      return res.status(403).json({ success: false, error: "Unauthorized role" });
    }

    return res.status(200).json({ success: true, customers });

  } catch (error) {
    console.error("Get Customers Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error in getCustomers" });
  }
};
// for single coustomer view
const getCustomer = async(req,res) =>{
  const {id} = req.params;
  try{
      const customer = await Customer.findById({_id:id}).populate('userId',{password:0}).populate('branchId') //password 0 means not taken
      return res.status(200).json({success:true, customer})
    }catch(error){
      return res.status(500).json({success: false, error:"Server Error in get Customer"})
    }
}

const editCustomer = async (req, res) => {
  try {
    const { id } = req.params; // customer ID
    const userId = req.user.id; // authenticated branch admin user ID

    // Check branch admin
    const branchAdmin = await BranchAdmin.findOne({ userId });
    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    // Fetch existing customer to get old image filenames
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }

    // Extract fields from request
    const {
      name, pno, email, homeAdd, nic, dob,
      gender, maritalStatus, passport, desc
    } = req.body;

    const updatedFields = {
      name,
      pno,
      email,
      homeAdd,
      nic,
      dob,
      gender,
      maritalStatus,
      passport,
      desc,
      userId,
      branchId: branchAdmin.branch,
      UpdateAt: Date.now()
    };

    // Handle profile image update
    if (req.files?.profileImage?.[0]) {
      deleteImage("customers", customer.profileImage); // delete old image
      updatedFields.profileImage = req.files.profileImage[0].filename;
    }

    // Handle passport image update
    if (req.files?.passportImage?.[0]) {
      deleteImage("passports", customer.passportImage); // delete old passport
      updatedFields.passportImage = req.files.passportImage[0].filename;
    }

    // Update the customer in DB
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedFields, { new: true });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      updatedCustomer
    });

  } catch (error) {
    console.error("Edit Customer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while updating customer" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Customer not found" });
    }

    // Delete profile image if exists
    if (customer.profileImage) {
      deleteImage("customers", customer.profileImage);
    }

    // Delete passport image if exists
    if (customer.passportImage) {
      deleteImage("passports", customer.passportImage);
    }

    // Delete customer from database
    await Customer.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete Customer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while deleting customer" });
  }
};
//for Main Admin
const getCustomersByBranchAdmin = async (req, res) => {
  try {
    const { branchAdminId } = req.params;
    const branchAdmin = await BranchAdmin.findById(branchAdminId);

    if (!branchAdmin) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const customers = await Customer.find({ userId: branchAdmin.userId })
      .populate("userId", { password: 0 })
      .populate("branchId");

    return res.status(200).json({ success: true, customers });

  } catch (error) {
    console.error("Error fetching customers by branch admin:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
const getCustomersByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(404).json({ success: false, error: "Branch Admin not found" });
    }

    const customers = await Customer.find({ branchId})
      .populate("userId", { password: 0 })
      .populate("branchId");

    return res.status(200).json({ success: true, customers });

  } catch (error) {
    console.error("Error fetching customers by branch admin:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



export {addCustomer,getCustomers, getCustomer, editCustomer, deleteCustomer,getCustomersByBranchAdmin, getCustomersByBranch}