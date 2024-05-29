const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
    }, 
    googleId:{
        type:String,
    },   
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    pincode: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date,
    },
    isGoogle: {
        default:false,
        type: Boolean,
    },   
    isActive: {
        default:true,
        type: Boolean,
    },    
})

const Userdb = mongoose.model('User',userSchema)
export {Userdb};