const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        required: true
    },
    registerNo: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date,
    },
    verified:{
        type:Boolean
    },
    isActive: {
        type: Boolean,
    },    
})

const Doctor = mongoose.model('Doctor',doctorSchema)
export {Doctor};