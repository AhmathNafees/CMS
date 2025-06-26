import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import fs from "fs";
import Supplier from "../models/supplierModel.js";
import User from "../models/User.js";

const deleteImage = (folder, filename) => {
  if (!filename) return;

  const filePath = path.resolve(folder, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted previous image: ${filePath}`);
    } catch (err) {
      console.error(`❌ Error deleting file ${filePath}:`, err.message);
    }
  } else {
    console.warn(`⚠️ File not found: ${filePath}`);
  }
};


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})

const addSupplier =async (req, res)=>{

    try{
        const {
            name,email,password,role,nic,dob,
            gender,maritalStatus,pno,
        }=req.body;

        const user =await Supplier.findOne({email})
        if(user){
            return res.status(400).json({success : false, error:"user already Registered "})
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newSupplier = new Supplier({
            name,
            pno,
            email,
            password:hashPassword,
            role,
            nic,
            dob,
            gender,
            maritalStatus,
            profileImage: req.file ? req.file.filename : "",
        })
        const savedUser = await newSupplier.save()

        await newSupplier.save()
        return res.status(200).json({success:true, message:"employee created"})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false, error:"server error in adding Supplier"})
    }
};

const getSuppliers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    let suppliers;
    suppliers = await Supplier.find()

    return res.status(200).json({ success: true, suppliers });

  } catch (error) {
    console.error("Get Customers Error:", error.message);
    return res.status(500).json({ success: false, error: "Server Error in getCustomers" });
  }
};


export{addSupplier,upload, getSuppliers}