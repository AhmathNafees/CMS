import Branch from "../models/BranchModel.js";

const addBranch = async(req, res)=>{
    try{
        const{branch_name, desc}= req.body;
        const newBranch = new Branch({
            branch_name,
            desc,
        })
        await newBranch.save()
        return res.status(200).json({success:true, branch:newBranch})

    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in Add Department"})
    }
}
export {addBranch}