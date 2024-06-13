const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status:{
        type:String,
        requied:true,
        default:'open',
    }
    
})

const Slotdb = mongoose.model('Slot',slotSchema);
export {Slotdb};