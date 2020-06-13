var express = require('express');
var router = express.Router();
var Post = require('../models/user');
var async = require('async');


module.exports = {
    lister: async (req, res, next) => {


        email = req.body.email
        // Check if there is a user with the same email
        //userFound =  Post.findOne({email});
        async.waterfall([
            function (done) {
                Post.findOne(
                    {email: email}
                )
                    .then(function (userFound) {
                        console.log(userFound);
                        done(null, userFound);
                        res.send(userFound)
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            }
        ]);

        if (foundUser) {
            return res.status(403).json({error: 'Email is already in use'});
        }


    },

    createUser: async (req, res, next) => {
        const user = new Post({
            name: req.body.name,
            firstname: req.body.firstname,
            email: req.body.email,
            password: req.body.password
        });
        const data = await user.save();
        res.json(data);


    },
    login: async (req, res, next) => {

        // Params
        email = req.body.email,
            password = req.body.password

        if (email == null || password == null) {
            return res.status(400).json({'error': 'missing parameters'});
            console.log(user.findOne({email: email}));
        }
        async.waterfall([
            function (done) {
                user.findOne({email: email})
                console.log(user.findOne({email: email}))
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({'error': 'user not exist in DB'});
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({'error': 'invalid password'});
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({'error': 'cannot log on user'});
            }
        });
    }
}
