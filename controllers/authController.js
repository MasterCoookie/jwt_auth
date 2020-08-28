const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secret = require('../secret');

// errors handler

const handleErrors = (err) => {
    let error = { email: '', password: '' };

    //incorrect email handling
    if (err.message === 'Incorrect email') {
        error.email = 'That email is not registered!';
    }

    //incorrect pwd handling
    if (err.message === 'Incorrect password') {
        error.password = 'Incorrect password!';
    }

    //duplicates error code, has to be handled separately
    if (err.code === 11000) {
        error.email = 'Email already registered!';
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
        // login after register
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
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
        // creating token and saving it as a cookie
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

const logout_get = (req, res) => {
    // cant actually delete a cookie, so we replace it with an empty one and give it 1ms expiery time
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}