const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default:true,
        required: true
    }
    
})

const Departmentdb = mongoose.model('Department',departmentSchema);
export {Departmentdb};