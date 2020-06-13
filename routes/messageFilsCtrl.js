// Imports
var models = require('../models/messageFils');
var msg = require('../models/message');
var user = require('../models/user');
var like = require('../models/like');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
    createMessage: async (req, res, next) => {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var messageId = req.params.messageId;
        var title = req.body.title;
        var content = req.body.content;

        if (title == null || content == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
            return res.status(400).json({'error': 'invalid parameters'});
        }
        console.log(userId);
        asyncLib.waterfall([
            function (done) {
                user.findOne(
                    {_id: userId})
                    .then(function (userFound) {
                        done(null, userFound);
                        console.log("hello word");
                        console.log(userFound.id);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    models.create({
                        title: title,
                        content: content,
                        likes: 0,
                        UserId: userFound.id,
                        messageId: messageId

                    })
                        .then(function (newMessage) {
                            console.log(newMessage);
                            done(null, newMessage);
                        })
                        .catch(function (err) {
                            return res.status(500).json({'error': 'unable to verify user'});
                        });
                } else {
                    res.status(404).json({'error': 'user not found'});
                }
            },
            function (newMessage, done) {
                if (newMessage) {
                    msg.findOne(
                        {_id: messageId})
                        .then(function (msg1) {
                            done(msg1, newMessage);
                        })
                        .catch(function (err) {
                            return res.status(500).json({'error': 'id erreuur'});
                        });

                } else {
                    res.status(404).json({'error': 'cannot comment'});
                }
            },
        ], function (msg1, newMessage) {
            if (msg1) {
                msg1.comments.push(newMessage);
                msg1.save();
                return res.status(201).json(newMessage)
            } else {
                return res.status(500).json({'error': 'cannot post message'});
            }
        });

    },

    listMessages: async (req, res, next) => {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }
        console.log(ITEMS_LIMIT)

        models.find({}, null, {
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: user,
                attributes: ['name']
            }]
        }).then(function (messages) {
            if (messages) {
                res.status(200).json(messages);
            } else {
                res.status(404).json({"error": "no messages found"});
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({"error": "invalid fields"});
        });
    }
}
