const User = require('../models/User');

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
        res.status(201).json(user);
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password })
    } catch(err) {

    }
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post
}