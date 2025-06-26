import mongoose, { Schema } from "mongoose";

const supplierSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    pno:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true, default: "supplier",},
    profileImage:{type:String},
    nic:{type:String},
    dob: {type:Date},
    gender : {type:String},
    maritalStatus: {type:String},

},{
    timestamps:true
}
);

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;