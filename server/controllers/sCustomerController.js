import User from "../models/User.js";
import Branch from "../models/BranchModel.js"
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
    const supplierId = req.supplier.id; // from authMiddleware
    console.log("REQ.USER:", req.supplier); // log user
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
    console.log("Received Body:", req.body);
    console.log("Received Files:", req.files);
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
// for see all customers
// const getCustomers = async (req, res) => {
//   try {
//     const supplierId = req.supplier.id;

//     // Get the logged-in supplier
//     const supplier = await User.findById(supplierId);

//     if (!supplier) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     let customers;

//     if (supplier.role === "admin") {
//       // ✅ Main Admin sees all customers
//       customers = await SCustomer.find()
//         .populate("supplierId", { password: 0 })
//         .populate("branchId");

//     } else if (supplier.role === "supplier") {
//       // ✅ Branch Admin sees only their customers
//       const supplier = await Supplier.findOne({ supplierId });

//       if (!supplier) {
//         return res.status(404).json({ success: false, error: "Branch Admin not found" });
//       }

//       customers = await SCustomer.find({ supplierId })
//         .populate("supplierId", { password: 0 })
//         .populate("branchId");

//     } else {
//       return res.status(403).json({ success: false, error: "Unauthorized role" });
//     }

//     return res.status(200).json({ success: true, customers });

//   } catch (error) {
//     console.error("Get Customers Error:", error.message);
//     return res.status(500).json({ success: false, error: "Server Error in getCustomers" });
//   }
// };
// // for single coustomer view
// const getCustomer = async(req,res) =>{
//   const {id} = req.params;
//   try{
//       const customer = await SCustomer.findById({_id:id}).populate('supplierId',{password:0}).populate('branchId') //password 0 means not taken
//       return res.status(200).json({success:true, customer})
//     }catch(error){
//       return res.status(500).json({success: false, error:"Server Error in get SCustomer"})
//     }
// }

// const editCustomer = async (req, res) => {
//   try {
//     const { id } = req.params; // customer ID
//     const supplierId = req.supplier.id; // authenticated branch admin supplier ID

//     // Check branch admin
//     const supplier = await Supplier.findOne({ supplierId });
//     if (!supplier) {
//       return res.status(404).json({ success: false, error: "Branch Admin not found" });
//     }

//     // Fetch existing customer to get old image filenames
//     const customer = await SCustomer.findById(id);
//     if (!customer) {
//       return res.status(404).json({ success: false, error: "SCustomer not found" });
//     }

//     // Extract fields from request
//     const {
//       name, pno, email, homeAdd, nic, dob,
//       gender, maritalStatus, passport, desc
//     } = req.body;

//     const updatedFields = {
//       name,
//       pno,
//       email,
//       homeAdd,
//       nic,
//       dob,
//       gender,
//       maritalStatus,
//       desc,
//       supplierId,
//       branchId: supplier.branch,
//     };

//     // Handle profile image update
//     if (req.files?.profileImage?.[0]) {
//       deleteImage("customers", customer.profileImage); // delete old image
//       updatedFields.profileImage = req.files.profileImage[0].filename;
//     }

//     // Handle passport PDF update
//     if (req.files?.passportPdf?.[0]) {
//       deleteImage("passports", customer.passportPdf); // delete old passport
//       updatedFields.passportPdf = req.files.passportPdf[0].filename;
//     }

//     // Handle CV PDF update
//     if (req.files?.cvPdf?.[0]) {
//       deleteImage("indexCustomerCV", customer.cvPdf); // delete old passport
//       updatedFields.cvPdf = req.files.cvPdf[0].filename;
//     }

//     // Update the customer in DB
//     const updatedCustomer = await SCustomer.findByIdAndUpdate(id, updatedFields, { new: true });

//     return res.status(200).json({
//       success: true,
//       message: "SCustomer updated successfully",
//       updatedCustomer
//     });

//   } catch (error) {
//     console.error("Edit SCustomer Error:", error.message);
//     return res.status(500).json({ success: false, error: "Server error while updating customer" });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const customer = await SCustomer.findById(id);
//     if (!customer) {
//       return res.status(404).json({ success: false, error: "SCustomer not found" });
//     }

//     // Delete profile image if exists
//     if (customer.profileImage) {
//       deleteImage("customers", customer.profileImage);
//     }

//     // Delete CV PDF if exists
//     if (customer.cvPdf) {
//       deleteImage("indexCustomerCV", customer.cvPdf);
//     }
//     // Delete Passports PDF if exists
//     if (customer.passportPdf) {
//       deleteImage("passports", customer.passportPdf);
//     }


//     // Delete customer from database
//     await SCustomer.findByIdAndDelete(id);

//     return res.status(200).json({ success: true, message: "SCustomer deleted successfully" });
//   } catch (error) {
//     console.error("Delete SCustomer Error:", error.message);
//     return res.status(500).json({ success: false, error: "Server error while deleting customer" });
//   }
// };
// //for Main Admin
// const getCustomersByBranchAdmin = async (req, res) => {
//   try {
//     const { branchAdminId } = req.params;
//     const supplier = await Supplier.findById(branchAdminId);

//     if (!supplier) {
//       return res.status(404).json({ success: false, error: "Branch Admin not found" });
//     }

//     const customers = await SCustomer.find({ supplierId: supplier.supplierId })
//       .populate("supplierId", { password: 0 })
//       .populate("branchId");

//     return res.status(200).json({ success: true, customers });

//   } catch (error) {
//     console.error("Error fetching customers by branch admin:", error.message);
//     res.status(500).json({ success: false, error: "Server Error" });
//   }
// };
// //for Main Admin
// const getCustomersByBranch = async (req, res) => {
//   try {
//     const { branchId } = req.params;

//     if (!branchId) {
//       return res.status(404).json({ success: false, error: "Branch not found" });
//     }

//     const customers = await SCustomer.find({ branchId})
//       .populate("supplierId", { password: 0 })
//       .populate("branchId");

//     return res.status(200).json({ success: true, customers });

//   } catch (error) {
//     console.error("Error fetching customers by branch admin:", error.message);
//     res.status(500).json({ success: false, error: "Server Error" });
//   }
// };


export {addSCustomer}