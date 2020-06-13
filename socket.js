#!/usr/bin/env node

/**
 * Module dependencies.
 */
var models = require('./models/message');
var messageFils = require('./models/messageFils');
var userM = require('./models/user');
var like = require('./models/like');
var asyncLib = require('async');
const mongoose = require('mongoose');
var jwtUtils = require('./utils/jwt.utils');

var app = require('./appSocket');
var debug = require('debug')('angular2-nodejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const TITLE_LIMIT = 0;
const CONTENT_LIMIT = 0;
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true}, () =>
    console.log('connected to db ilyes!'));
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var io = require('socket.io').listen(server);

io.on('connection', (socket) => {

    console.log('new connection made.');

    socket.on('join', function (data) {
        // var user ;
        var userF = null;
        socket.join(data.room);
        console.log(data.user + ' joined this group :) ');
        asyncLib.waterfall([
                function (done) {
                    userM.findOne(
                        {_id: data.userId})
                        .then(function (userFound) {
                            done(userFound);
                        })
                        .catch(function (err) {
                            io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'unable to verify user'});
                        });
                }
            ],
            function (userFound) {
                if (userFound) {
                    console.log("us connected", userFound);
                    userFound.active = 1;
                    userFound.save();
                    // userFound.save;
                    save;
                    console.log("userfoun sattus ", userFound.active);
                    socket.broadcast.to(data.room).emit('new user joined', {
                        user: userFound,
                        message: ' has joined this group ' + data.room
                    });
                    return userFound;
                }
            });
    });

    socket.on('leave', function (data) {
        console.log(data.user + 'left the room : ' + data.room);
        socket.broadcast.to(data.room).emit('left room', {user: data.user, message: ' has left this room.'});
        socket.leave(data.room);
    });
    /*
    Socket commentaire principale
     */

    socket.on('message', function (data) {
        var headerAuth = data.token;
        var userId = jwtUtils.getUserId(headerAuth);
        // Params
        var groupId = data.room;
        var title = data.title;
        var content = data.message;
        console.log(data.token);
        console.log("room", data.room);
        console.log("message ", data.message);
        if (title == null || content == null) {
            socket.broadcast.to(data.room).emit('erreur_message', {erreur: 'missing parameters'});
        } else {
            asyncLib.waterfall([
                function (done) {
                    userM.findOne(
                        {_id: userId})
                        .then(function (userFound) {
                            console.log(userFound);
                            done(null, userFound);
                            console.log("hello word");
                            console.log(userFound.id);
                        })
                        .catch(function (err) {
                            socket.broadcast.to(data.room).emit('erreur_message', {erreur: 'unable to verify user'});
                        });
                },
                function (userFound, done) {
                    if (userFound) {
                        models.create({
                            title: title,
                            content: content,
                            likes: 0,
                            UserId: userFound.id,
                            username: userFound.name + ' ' + userFound.firstname,
                            groupId: groupId
                        })
                            .then(function (newMessage) {
                                // console.log(newMessage);
                                done(newMessage);
                            });
                    } else {
                        socket.broadcast.to(data.room).emit('erreur_message', {erreur: 'user not found'});
                    }
                },
            ], function (newMessage) {
                if (newMessage) {
                    console.log(newMessage);
                    io.in(data.room).emit('new message', newMessage);
                    return newMessage;
                } else {
                    console.log("erreur");
                    io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'cannot post message'});
                }
            });

        }
    });
    /**
     * Socket sous commentaire
     */
    socket.on('sousMessage', function (data) {
        var index = data.index;
        var headerAuth = data.token;
        var userId = jwtUtils.getUserId(headerAuth);
        // Params
        var messageId = data.room;
        var title = data.room;
        var content = data.message;

        if (title == null || content == null) {
            socket.broadcast.to(data.room).emit('erreur_message', {erreur: 'missing parameters'});
        }
        asyncLib.waterfall([
            function (done) {
                userM.findOne(
                    {_id: userId})
                    .then(function (userFound) {
                        done(null, userFound);
                        console.log("hello word");
                        console.log(userFound.id);
                    })
                    .catch(function (err) {
                        io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    messageFils.create({
                        title: title,
                        content: content,
                        likes: 0,
                        UserId: userFound.id,
                        username: userFound.name + ' ' + userFound.firstname,
                        messageId: messageId

                    })
                        .then(function (newMessage) {
                            console.log(newMessage);
                            done(null, newMessage);
                        })
                        .catch(function (err) {
                            io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'unable to verify user'});
                        });
                } else {
                    io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'user not found'});
                }
            },
            function (newMessage, done) {
                if (newMessage) {
                    models.findOne(
                        {_id: messageId})
                        .then(function (msg1) {
                            done(msg1, newMessage);
                        })
                        .catch(function (err) {
                            io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'id erreuur'});
                        });

                } else {
                    io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'cannot comment'});
                }
            },
        ], function (msg1, newMessage) {
            if (msg1) {
                msg1.comments.push(newMessage);
                msg1.save();
                console.log(newMessage);
                io.in(data.room).emit('new Sousmessage', {indx: index, newMsg: newMessage});
                return newMessage;
            } else {
                io.in(data.room).emit(data.room).emit('erreur_message', {erreur: 'cannot post message'});
            }
        });
    });
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
