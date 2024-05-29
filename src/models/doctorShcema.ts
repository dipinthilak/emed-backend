const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    googleId:{
        type:String,
    },    
    email: {
        type: String,
        required: true
    },
    registerNo: {
        type: String,
    },
    department: {
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
    gender: {
        type: String,
    },
    dob: {
        type: Date,
    },
    password: {
        type: String,
        required: true
    },
    verified:{
        default:false,
        type:Boolean
    },
    isVerified:{
        default:false,
        type:Boolean
    },
    isActive: {
        default:false,
        type: Boolean,
    }, 
    isGoogle: {
        default:false,
        type: Boolean,
    },    
})

const Doctordb = mongoose.model('Doctor',doctorSchema)
export {Doctordb};