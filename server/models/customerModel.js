import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
    name:{type:String, required:true},
    pno:{type:String},
    email:{type:String,},
    homeAdd:{type:String},
    nic:{type:String},
    dob: {type:Date},
    gender : {type:String},
    maritalStatus: {type:String},
    profileImage:{type:String},
    passportPdf: { type: String },     // ← updated
    cvPdf: { type: String },
    desc: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    status: {
    type: String,
    enum: ['begin', 'processing', 'complete', 'reject'],
    default: 'begin'},
},{ timestamps: true } // ✅ enables createdAt and updatedAt automatically
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;