import BranchAdmin from "../models/BranchAdminModel.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})

const addBranchAdmin =async (req, res)=>{

    try{
        const {
            name,email,password,role,nic,dob,
            gender,maritalStatus,branch,
        }=req.body;

        const user =await User.findOne({email})
        if(user){
            return res.status(400).json({success : false, error:"user already Registered "})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashPassword,
            role,
            profileImage: req.file ? req.file.filename : "",
        })
        const savedUser = await newUser.save()

        const newBranchAdmin = new BranchAdmin({
            userId: savedUser._id,
            nic,
            dob,
            gender,
            maritalStatus,
            branch,
        })

        await newBranchAdmin.save()
        return res.status(200).json({success:true, message:"employee created"})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"server error in adding branch admin"})
    }

    
}

export {addBranchAdmin, upload}