const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const config = require('../config/database');

//registration
router.post('/register', (req, res) => {
    let newUser = new User.userModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        console.log(user)
        if (err) {
            res.json({ success: false, msg: 'failed to register user' + err });
        } else {
            res.json({ success: true, msg: 'user registered' });
        }
    });
});

//authentication
router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ success: false, msg: 'user not found' })

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                //two ways:
                //const token = jwt.sign(user.toJSON(), config.secret, {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 //one week
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else return res.json({ success: false, msg: 'wrong password' });
        });
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;