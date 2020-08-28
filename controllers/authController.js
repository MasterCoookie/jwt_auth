const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secret = require('./secret');

// errors handler

const handleErrors = (err) => {
    let error = { email: '', password: '' };

    //duplicates error code, has to be handled separately
    if (err.code === 11000) {
        error.email = 'email already registered';
        return error;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        })
    }

    return error;
}

const maxAge = 24 * 3600;
const createToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    });
}

const signup_get = (req, res) => {
    res.render('signup')
}

const login_get = (req, res) => {
    res.render('login');
}

const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id });
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        res.status(200).json({ user: user._id })
    } catch(err) {
        console.log(err);
        res.status(400).json({})
    }
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post
}