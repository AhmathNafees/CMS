import mongoose, { Schema } from "mongoose";

const branchAdminSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:"User", required: true},
    employeeId:{type:String, required: true, unique: true},
    dob: {type:Date},
    gender : {type:String},
    maritalStatus: {type:String},
    branch : {type:Schema.Types.ObjectId, ref:"Branch", required:true},
    createAt:{type: Date, default:Date.now},
    UpdateAt:{type: Date, default:Date.now},

})