const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    jobTitle: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        unique: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);