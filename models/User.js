const mongoose = require('mongoose');
const { isEmail } = require('validator');
//password hashing 
const bcrypt = require('bcrypt');

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

// mongoose hooks. They fire afer a certain event happens
// .post afer event, .pre b4 it
// conviniently, we have access to the data in this obj
userSchema.pre('save', async function(next) {
    // hashing password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    console.log(email, password);
    const user = await this.findOne({ email });
    if (user) {
        // password compareson
        const auth = bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;