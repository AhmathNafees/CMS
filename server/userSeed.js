import User from './models/User';
import bcrypt from 'bcrypt';
import connectToDatabase from './db/db';
const userRegister = async ()=>{
    connectToDatabase()
    try{
        const hashPassword = await bcrypt.hash("admin",10)
        const newUser= new User({
            name : "Admin",
            email : "admin@gmail.com",
            Password : hashPassword,
            role: "admin",
        })
        await newUser.save()

    }catch(error){
        console.log(error)
    }
}
userRegister()