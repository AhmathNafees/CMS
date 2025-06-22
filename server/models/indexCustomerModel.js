import mongoose, { Schema } from "mongoose";

const IndexCustomerSchema = new Schema({
    name:{type:String, required:true},
    pno:{type:String, required:true},
    location:{type:String},
    gender : {type:String},
    profileImage:{type:String},
    desc: { type: String },
    passportPdf: { type: String },     // ← updated
    cvPdf: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },

},{timestamps:true});

const IndexCustomer = mongoose.model("IndexCustomer", IndexCustomerSchema);
export default IndexCustomer;