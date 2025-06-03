import Branch from "../models/BranchModel.js";
const getBranches =async(req, res)=>{
    try{
        const branches = await Branch.find()
        return res.status(200).json({success:true, branches})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in get Department"})
    }
}
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
export {addBranch, getBranches}