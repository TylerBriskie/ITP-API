const express = require('express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();

/* LOGIN page. */
router.get('/', function(req, res, next) {
    res.send('hello')
});

/*/ NEW USER /*/
router.post('/signup', (req, res, next) => {
    let userData = req.body;
    bcrypt.hash(userData.password, 5, (err, hash) => {
        if (err){
            res.status(400).send("ERROR hashing password", err);
        }
        User.create({
            email: userData.email,
            password: hash
        }).then((user) => {
            res.send(user);
        }).catch(err => {
            res.status(400).send("ERROR adding user");
        });

    });
});


/* USER LOGIN */
router.post('/login', (req, res, next)=> {

    let userData = req.body;
    User.findOne({email: userData.email}, (err, user) => {
        if (err){
            console.log("error!  Code 72ne82n90w, error logging in: ", err)
        } else {
            if (!user){
                res.status(401).send("Email Not Found");
            } else {
                bcrypt.compare(userData.password, user.password, (err, login) => {
                    if (login){
                        // let payload = { subject: user._id};
                        // let token = jwt.sign(payload, process.env.JWT_SECRET);
                        // res.cookie('token', token);
                        res.status(200).send('success');
                    } else {
                        res.status(403).send('We were unable to log you in with the supplied credentials');
                    }
                })
            }
        }
    })
});

router.post('/logout', (req, res, next) => {
    console.log('logging out!');
    res.clearCookie('token');
    res.redirect('/');
});



module.exports = router;
