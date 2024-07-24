const mongoose = require("mongoose");


const EducationSchema = new mongoose.Schema({
    institution: {
        type: String, required: true
    },
    degree: {
        type: String, required: true
    },
    field: {
        type: String, required: true
    },
    gradYear: {
        type: Number, required: true
    },
});

const ExperienceSchema = new mongoose.Schema({
    from: {
        type: String, required: true
    },
    to: {
        type: String, required: true
    },
    experience: {
        type: String, required: true
    },
});

const doctorSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        default: false,
        type: Boolean
    },
    isVerified: {
        default: false,
        type: Boolean
    },
    isActive: {
        default: true,
        type: Boolean,
    },
    isGoogle: {
        default: false,
        type: Boolean,
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
    profilePic: {
        type: String,
    },
    identityProof: {
        type: String,
    },
    identityProofId: {
        type: String,
    },
    identityProofDoc: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date,
    },


    highSchool: {
        type: String
    },
    hsNumber: {
        type: String
    },
    hsYear: {
        type: Number
    },
    hsDoc: {
        type: String
    },
    hsSchool: {
        type: String
    },
    hssNo: {
        type: String
    },
    hssYear: {
        type: Number
    },
    hssDoc: {
        type: String
    },
    mbbsCollege: {
        type: String
    },
    mbbsNo: {
        type: String
    },
    mbbsYear: {
        type: Number
    },
    mbbsDoc: {
        type: String
    },
    registrationNo: {
        type: Number
    },
    department: {
        type: String,
    },
    education: {
        type: [EducationSchema]
    },
    eduDocs: {
        type: [String]
    },


    about: {
        type: String
    },
    experiences: {
        type: [ExperienceSchema]
    },
    expDocs: {
        type: [String]
    },
},
    {
        timestamps: true,
    }
);
const Doctordb = mongoose.model('Doctor', doctorSchema)
export { Doctordb };