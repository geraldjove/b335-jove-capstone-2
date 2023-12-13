const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: String,
        required: [true,  'Please enter first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please enter last name']
    },
    email: {
        type: String,
        required: [true,  'Please enter email']
    },
    password: {
        type: String,
        required: [true,  'Please enter password']
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    mobileNo: {
        type: String,
        require: [true, 'Please enter mobile number']
    }
});

module.exports = mongoose.model('User', userSchema);