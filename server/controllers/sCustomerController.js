import fs from "fs";
import path from "path";
import SCustomer from "../models/sCustomerModel.js";
import Supplier from "../models/supplierModel.js";

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


const addSCustomer = async (req, res) => {
  try {
    const supplierId = req.user._id; // from authMiddleware
    // console.log("REQ.USER:", req.supplier); // log user
    const supplier = await Supplier.findById(supplierId )

    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    const {
      name, pno, email, homeAdd, nic, dob, gender, maritalStatus,desc
    } = req.body;
    // Multer handles multiple files via req.files when using upload.fields
    const profileImage = req.files?.profileImage?.[0]?.filename  || "";
    const passportPdf = req.files?.passportPdf?.[0]?.filename || "";
    const cvPdf = req.files?.cvPdf?.[0]?.filename || "";
    //  console.log("Uploaded Files:", req.files);
    // console.log("Received Body:", req.body);
    // console.log("Received Files:", req.files);
    const newSCustomer = new SCustomer({
      name,
      pno,
      email,
      homeAdd,
      nic,
      dob,
      gender,
      maritalStatus,
      profileImage,
      passportPdf,
      cvPdf,
      supplierId,
      desc,
    });
    // console.log("Uploaded Files:", req.files);
    await newSCustomer.save();
    return res.status(201).json({ success: true, message: "SCustomer added successfully" });
    
  } catch (error) {
    console.error("Add SCustomer Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
//for see all sCustomers
const getSCustomers = async (req, res) => {
  try {
    const supplierId = req.supplier?._id || req.user?._id;
    const role = req.user?.role || req.supplier?.role;

    let sCustomers;

    if (role === "admin") {
      // Admin sees all customers
      sCustomers = await SCustomer.find().populate("supplierId", { password: 0 })
    } else if (role === "supplier") {
      // Supplier sees only their own customers
      sCustomers = await SCustomer.find({ supplierId }).populate("supplierId", { password: 0 });
    } else {
      return res.status(403).json({ success: false, error: "Unauthorized role" });
    }

    return res.status(200).json({ success: true, sCustomers });
  } catch (error) {
    console.error("Get Customers Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error in getCustomers" });
  }
};

//for single coustomer view
const getSCustomer = async(req,res) =>{
  const {id} = req.params;
  try{
      const sCustomer = await SCustomer.findById({_id:id}).populate('supplierId',{password:0}) //password 0 means not taken
      return res.status(200).json({success:true, sCustomer})
    }catch(error){
      return res.status(500).json({success: false, error:"Server Error in get SCustomer"})
    }
}

const editSCustomer = async (req, res) => {
  try {
    const { id } = req.params; // sCustomer ID
    const supplierId = req.user.id; // authenticated supplier ID 

    // Check supplier
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    // Fetch existing sCustomer to get old image filenames
    const sCustomer = await SCustomer.findById(id);
    if (!sCustomer) {
      return res.status(404).json({ success: false, error: "SCustomer not found" });
    }

    // Extract fields from request
    const {
      name, pno, email, homeAdd, nic, dob,
      gender, maritalStatus, desc
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
      desc,
      supplierId,
    };

    // Handle profile image update
    if (req.files?.profileImage?.[0]) {
      deleteImage("customers", sCustomer.profileImage); // delete old image
      updatedFields.profileImage = req.files.profileImage[0].filename;
    }

    // Handle passport PDF update
    if (req.files?.passportPdf?.[0]) {
      deleteImage("passports", sCustomer.passportPdf); // delete old passport
      updatedFields.passportPdf = req.files.passportPdf[0].filename;
    }

    // Handle CV PDF update
    if (req.files?.cvPdf?.[0]) {
      deleteImage("indexCustomerCV", sCustomer.cvPdf); // delete old passport
      updatedFields.cvPdf = req.files.cvPdf[0].filename;
    }

    // Update the sCustomer in DB
    const updatedCustomer = await SCustomer.findByIdAndUpdate(id, updatedFields, { new: true });

    return res.status(200).json({
      success: true,
      message: "SCustomer updated successfully",
      updatedCustomer
    });

  } catch (error) {
    console.error("Edit SCustomer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while updating sCustomer" });
  }
};

const deleteSCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const sCustomer = await SCustomer.findById(id);
    if (!sCustomer) {
      return res.status(404).json({ success: false, error: "SCustomer not found" });
    }

    // Delete profile image if exists
    if (sCustomer.profileImage) {
      deleteImage("customers", sCustomer.profileImage);
    }

    // Delete CV PDF if exists
    if (sCustomer.cvPdf) {
      deleteImage("indexCustomerCV", sCustomer.cvPdf);
    }
    // Delete Passports PDF if exists
    if (sCustomer.passportPdf) {
      deleteImage("passports", sCustomer.passportPdf);
    }


    // Delete sCustomer from database
    await SCustomer.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "SCustomer deleted successfully" });
  } catch (error) {
    console.error("Delete SCustomer Error:", error.message);
    return res.status(500).json({ success: false, error: "Server error while deleting sCustomer" });
  }
};
//for Main Admin
const getSCustomersBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }

    const sCustomers = await SCustomer.find({ supplierId})
      .populate("supplierId", { password: 0 })

    return res.status(200).json({ success: true, sCustomers });

  } catch (error) {
    console.error("Error fetching sCustomers by Supplier:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


export {addSCustomer, getSCustomers, getSCustomer, editSCustomer, deleteSCustomer, getSCustomersBySupplier}