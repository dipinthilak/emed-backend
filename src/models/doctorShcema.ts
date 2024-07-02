const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    googleId:{
        type:String,
        default:null,
    },    
    email: {
        type: String,
        required: true,
        unique:true,
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
        default:true,
        type: Boolean,
    }, 
    isGoogle: {
        default:false,
        type: Boolean,
    },    
},
{
    timestamps: true,
}
);

const Doctordb = mongoose.model('Doctor',doctorSchema)
export {Doctordb};