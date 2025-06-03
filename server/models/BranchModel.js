import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    branch_name: {type: String, required: true},
    desc: {type:String},
    createAt: {type:Date, default:Date.now},
    updateAt: {type:Date, default:Date.now}
})

const Branch = mongoose.model("Branch",branchSchema)
export default Branch;