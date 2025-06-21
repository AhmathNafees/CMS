import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
    name:{type:String, required:true},
    pno:{type:String, required:true},
    email:{type:String,},
    homeAdd:{type:String, required:true},
    nic:{type:String, required: true},
    dob: {type:Date},
    gender : {type:String},
    maritalStatus: {type:String},
    profileImage:{type:String},
    passport: { type: String },
    desc: { type: String },
    passportImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    status: {
    type: String,
    enum: ['begin', 'processing', 'complete', 'reject'],
    default: 'begin'},
    createAt:{type: Date, default:Date.now},
    updateAt:{type: Date, default:Date.now},

});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;