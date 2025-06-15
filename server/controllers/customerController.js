import BranchAdmin from "../models/BranchAdminModel.js"
import Customer from "../models/customerModel.js"

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
     console.log("Uploaded Files:", req.files);
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
    console.log("Uploaded Files:", req.files);
    await newCustomer.save();
    return res.status(201).json({ success: true, message: "Customer added successfully" });
  } catch (error) {
    console.error("Add Customer Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// for see all customers
const getCustomers = async (req, res) => {
  try{
        const customers = await Customer.find().populate('userId',{password:0}).populate('branchId') //password 0 means not taken
        return res.status(200).json({success:true, customers})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in get Customers"})
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

export {addCustomer,getCustomers, getCustomer}