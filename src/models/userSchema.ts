const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
});


const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
    },
    googleId: {
        type: String,
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
        default: false,
        type: Boolean,
    },
    isActive: {
        default: true,
        type: Boolean,
    },
    members: [memberSchema]

},
    {
        timestamps: true,
    })

const Userdb = mongoose.model('User', userSchema)
export { Userdb };