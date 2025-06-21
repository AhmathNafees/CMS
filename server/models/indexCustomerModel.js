import mongoose, { Schema } from "mongoose";

const IndexCustomerSchema = new Schema({
    name:{type:String, required:true},
    pno:{type:String, required:true},
    location:{type:String},
    gender : {type:String},
    profileImage:{type:String},
    desc: { type: String },
    passportImage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    createAt:{type: Date, default:Date.now},
    updateAt:{type: Date, default:Date.now},

});

const IndexCustomer = mongoose.model("IndexCustomer", IndexCustomerSchema);
export default IndexCustomer;