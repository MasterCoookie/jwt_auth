const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        // specifing err msg
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        // email validation
        // without 3rd party : (val) => {  } return true if valid
        validate: [isEmail, 'Please enter a valid emial']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Your password has to be at least 6 characters long']
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;