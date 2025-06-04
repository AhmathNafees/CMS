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

const getBranch = async(req, res)=> {
    try{
        const {id} = req.params;
        const branch = await Branch.findById({_id:id})
        return res.status(200).json({success:true, branch})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in get Department"})
    }
}
const updateBranch = async(req,res)=>{
    try{
        const {id} = req.params;
        const {branch_name, desc} = req.body;
        const updateBra = await Branch.findByIdAndUpdate({_id:id},
            {branch_name,desc},{ new: true }

        )
        return res.status(200).json({success:true, updateBra})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in edit Department"})
    }

}

const deleteBranch = async(req, res) =>{
    try{
        const {id} = req.params;
        const deletebra = await Branch.findByIdAndDelete({_id:id})
        return res.status(200).json({success:true, deletebra})
    }catch(error){
        return res.status(500).json({success: false, error:"Server Error in Delete Department"})
    }
}

export {addBranch, getBranches, getBranch, updateBranch, deleteBranch}