import mongoose from "mongoose";
import BranchAdmin from "./BranchAdminModel.js";
import User from "./User.js";

const branchSchema = new mongoose.Schema({
    branch_name: { type: String, required: true },
    desc: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

// Cascading delete for BranchAdmins and Users
branchSchema.pre("findOneAndDelete", async function (next) {
    const branchId = this.getQuery()?._id;
    if (branchId) {
        // 1. Find all branch admins for this branch
        const branchAdmins = await BranchAdmin.find({ branch: branchId });

        // 2. Extract user IDs linked to branch admins
        const userIds = branchAdmins.map(admin => admin.userId);

        // 3. Delete branch admins
        await BranchAdmin.deleteMany({ branch: branchId });

        // 4. Delete corresponding users
        await User.deleteMany({ _id: { $in: userIds } });
    }
    next();
});

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
