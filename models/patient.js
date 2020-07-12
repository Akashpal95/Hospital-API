const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    reports: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Report'
        }
    ]
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;