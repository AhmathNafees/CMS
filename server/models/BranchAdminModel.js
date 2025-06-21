import mongoose, { Schema } from "mongoose";

const branchAdminSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:"User", required: true},
    nic:{type:String, required: true, unique: true},
    dob: {type:Date},
    gender : {type:String},
    maritalStatus: {type:String},
    branch : {type:Schema.Types.ObjectId, ref:"Branch",required:true},
    createAt:{type: Date, default:Date.now},
    updateAt:{type: Date, default:Date.now},

});

const BranchAdmin = mongoose.model("BranchAdmin", branchAdminSchema);
export default BranchAdmin;