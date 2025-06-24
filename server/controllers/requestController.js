
import Request from "../models/requestModel.js"
import IndexCustomer from "../models/indexCustomerModel.js"
import User from '../models/User.js';
import BranchAdmin from "../models/BranchAdminModel.js";


const createRequest = async (req, res) => {
  try {
    const { indexCustomerId, branchId } = req.body;
    const requestedBy = req.user.id; // From JWT token
    console.log(indexCustomerId); 
    console.log(branchId); 
    if (!indexCustomerId || !branchId) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const indexCustomer = await IndexCustomer.findById(indexCustomerId);
    if (!indexCustomer) {
      return res.status(404).json({ success: false, error: "Index customer not found" });
    }

    const newRequest = new Request({
      indexCustomer: indexCustomerId,
      branch: branchId,
      requestedBy,
    });

    await newRequest.save();

    return res.status(201).json({ success: true, message: "Request sent successfully" });
  } catch (error) {
    console.error("Error in create Request:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const getRequests = async (req, res) => {
  try {
    const branchAdminId = req.user.id;

    const branchAdmin = await User.findById(branchAdminId);
    if (!branchAdmin || branchAdmin.role !== "branchAdmin") {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    // Now find branchId from branchAdmin model
    const fullBranchAdmin = await BranchAdmin.findOne({ userId: branchAdminId }).populate("branch");
    if (!fullBranchAdmin) {
      return res.status(404).json({ success: false, error: "Branch admin data not found" });
    }

    const branchId = fullBranchAdmin.branch._id;

    const requests = await Request.find({
      branch: branchId,
      status: "pending",
    })
      .populate("indexCustomer")
      .populate("requestedBy", "name")
      .populate("handledBy", "name")
      .populate("branch", "branch_name");
      const validRequests = requests.filter(req => req.indexCustomer); // 🔥 Remove ones with missing customer

    return res.json({ success: true, requests:validRequests });
  } catch (error) {
    console.error("Error getting branch requests:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.user.id })
      .populate("indexCustomer")
      .populate("handledBy", "name")
      .populate("branch", "branch_name");
       const validRequests = requests.filter(req => req.indexCustomer); // 🔥 Remove ones with missing customer

    return res.json({ success: true, requests:validRequests });
  } catch (err) {
    console.error("Failed to load my requests", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};



const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const request = await Request.findById(id).populate("indexCustomer");

    if (!request) {
      return res.status(404).json({ success: false, error: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, error: "Already handled" });
    }

    request.status = status;
    request.handledBy = req.user.id; // store who accepted/rejected
    await request.save();

    // If accepted, convert indexCustomer → customer
    if (status === "accepted") {
      const { name, pno, location, gender, profileImage, passportPdf, cvPdf, branchId} = request.indexCustomer;
      const Customer = (await import("../models/customerModel.js")).default;

      await Customer.create({
        name,
        pno,
        location,
        gender,
        profileImage,
        passportPdf,
        cvPdf,
        userId: req.user.id,// ✅ Save branch admin’s user ID here
        branchId,
      });
    }

    res.json({ success: true, message: "Request updated" });
  } catch (error) {
    console.error("Error updating request status:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let filter = {};

    if (userRole === "branchAdmin") {
      // Only show requests handled by this branchAdmin
      filter.handledBy = userId;
    } else if (userRole === "customerCare") {
      // Only show requests created by this customerCare
      filter.requestedBy = userId;
    }

    const logs = await Request.find(filter)
      .populate("indexCustomer")
      .populate("requestedBy", "name")
      .populate("handledBy", "name")
      .populate("branch", "branch_name")
      .sort({ createdAt: -1 });

    const validLogs = logs.filter(req => req.indexCustomer);

    return res.json({ success: true, logs: validLogs });
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export{createRequest,getRequests,updateRequestStatus, getMyRequests,getAllLogs}