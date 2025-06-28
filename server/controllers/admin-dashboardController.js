import BranchAdmin from "../models/BranchAdminModel.js";
import Branch from "../models/BranchModel.js"
import Customer from "../models/customerModel.js";
import IndexCustomer from "../models/indexCustomerModel.js";
import Request from "../models/requestModel.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const getSummary =async(req,res)=>{
    try{
        const totalBranches = await Branch.countDocuments();

        const totalBranchAdmins = await BranchAdmin.countDocuments();

        const totalCustomerCares = await User.countDocuments({
            role: "customerCare"
        });
        const totalBranchAdmin = await User.countDocuments({
            role: "branchAdmin"
        });
        const totalMainAdmin = await User.countDocuments({
            role: "admin"
        });     
        const totalCustomers = await Customer.countDocuments();

        const customerStatus = await Customer.aggregate([
            {
                $group:{
                    _id:"$status",
                    count : {$sum:1}
                }
            }
        ])
        const customerSummary ={
            begin:customerStatus.find(item=>item._id === "begin")?.count || 0,
            processing:customerStatus.find(item=>item._id === "processing")?.count || 0,
            complete:customerStatus.find(item=>item._id === "complete")?.count || 0,
            reject:customerStatus.find(item=>item._id === "reject")?.count || 0
        }

        const totalIndexCustomers = await IndexCustomer.countDocuments();
        // const totalRequests = await Request.countDocuments();
        const requestStatus =await Request.aggregate([
            {
                $group:{
                    _id:"$status",
                    count : {$sum:1}
                }
            }
        ])
        const indexCustomerSummary={
            pending:requestStatus.find(item=>item._id === "pending")?.count || 0,
        }

        return res.status(200).json({
            totalBranches,
            totalBranchAdmins,
            totalCustomerCares,
            totalCustomers,
            totalIndexCustomers,
            customerSummary,
            indexCustomerSummary,
            totalBranchAdmin,
            totalMainAdmin
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"Admin Dashoard Summary Error"})
    }
}

const getCustomerCareSummary = async (req, res) => {
  try {
    const customerCareId = req.user._id; // Ensure your auth middleware sets req.user

    // Count all requests sent by this customer care user
    const totalRequests = await Request.countDocuments({ requestedBy: customerCareId });

    const totalIndexCustomers = await IndexCustomer.countDocuments({ userId: customerCareId });

    // Group by status for this customer care
    const requestStatus = await Request.aggregate([
      { $match: { requestedBy: new mongoose.Types.ObjectId(customerCareId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusSummary = {
      total: totalRequests,
      accepted: requestStatus.find(item => item._id === "accepted")?.count || 0,
      pending: requestStatus.find(item => item._id === "pending")?.count || 0,
      rejected: requestStatus.find(item => item._id === "rejected")?.count || 0
    };

    return res.status(200).json({ success: true, 
        statusSummary,
        totalIndexCustomers
        
    });

  } catch (error) {
    console.error("CustomerCare Summary Error:", error.message);
    return res.status(500).json({ success: false, error: "Customer Care Dashboard Error" });
  }
};

const getBranchAdminSummary=async(req,res)=>{
    try{
        const branchAdminId =req.user._id

        const totalCustomers = await Customer.countDocuments({
            userId:branchAdminId
        });

        const customerStatus = await Customer.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(branchAdminId) } },
            {
                $group:{
                    _id:"$status",
                    count : {$sum:1}
                }
            }
        ])
        const customerSummary ={
            begin:customerStatus.find(item=>item._id === "begin")?.count || 0,
            processing:customerStatus.find(item=>item._id === "processing")?.count || 0,
            complete:customerStatus.find(item=>item._id === "complete")?.count || 0,
            reject:customerStatus.find(item=>item._id === "reject")?.count || 0
        }

        return res.status(200).json({

            totalCustomers,
            customerSummary,
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"Admin Dashoard Summary Error"})
    }

}

const getSupplierSummary=async(req,res)=>{
    try{
        const supplierId =req.supplier._id

        const totalCustomers = await Customer.countDocuments({
            supplierId
        });

        const customerStatus = await Customer.aggregate([
            { $match: { supplierId: new mongoose.Types.ObjectId(supplierId) } },
            {
                $group:{
                    _id:"$status",
                    count : {$sum:1}
                }
            }
        ])
        const customerSummary ={
            begin:customerStatus.find(item=>item._id === "begin")?.count || 0,
            processing:customerStatus.find(item=>item._id === "processing")?.count || 0,
            complete:customerStatus.find(item=>item._id === "complete")?.count || 0,
            reject:customerStatus.find(item=>item._id === "reject")?.count || 0
        }

        return res.status(200).json({

            totalCustomers,
            customerSummary,
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"Supplier Dashoard Summary Error"})
    }

}
export {getSummary,getCustomerCareSummary,getBranchAdminSummary,getSupplierSummary}