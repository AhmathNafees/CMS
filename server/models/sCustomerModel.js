import mongoose, { Schema } from "mongoose";

const scustomerSchema = new Schema({
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
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    status: {
    type: String,
    enum: ['begin', 'processing', 'complete', 'reject'],
    default: 'begin'},
},{ timestamps: true } // ✅ enables createdAt and updatedAt automatically
);

const SCustomer = mongoose.model("SCustomer", scustomerSchema);
export default SCustomer;