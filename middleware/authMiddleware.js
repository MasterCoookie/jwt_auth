const jwt = require('jsonwebtoken');
const secret = require('../secret');

const requireAuth = (req, res, next) => {
    // using this middleware we can make it so any page can require the user to be authenticated
    const token = req.cookies.jwt;

    //check for and verify token
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireAuth }