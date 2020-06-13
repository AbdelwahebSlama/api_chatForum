'use strict';
/**
 * imports
 * */
var privateRoom = require('./models/privateRoom');
var userM = require('./models/user');
var asyncLib = require('async');
const mongoose = require('mongoose');
var jwtUtils = require('./utils/jwt.utils');

const express = require('express')
const app = express()

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port 2000
const server = app.listen(2000)
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true}, () =>
    console.log('connected to db ilyes!'));

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
    var roomFoundID = '';
    var rommId = '';
    /**************************/
    //listen on new room
    socket.on('new_room', (data) => {
        var headerAuth = data.token;
        var userIdSender = jwtUtils.getUserId(headerAuth);
        var userIdReciver = data.userIdReciver;

        asyncLib.waterfall([
            function (done) {
                userM.findOne(
                    {_id: userIdSender})
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        socket.broadcast.to(data.room).emit('erreur_message', {erreur: 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    privateRoom.findOne({
                            UserIdSender: userIdSender,
                            UserIdReciver: userIdReciver
                        }
                    )
                        .then(function (roomFound) {
                            console.log("room found ", roomFound);
                            done(null, roomFound);
                        });
                }
            },
            function (roomFound, done) {
                if (!roomFound) {
                    privateRoom.findOne(
                        {
                            UserIdSender: userIdReciver,
                            UserIdReciver: userIdSender
                        }
                    ).then(function (newRoom) {
                            if (!newRoom) {
                                privateRoom.create({
                                    UserIdSender: userIdSender,
                                    UserIdReciver: userIdReciver
                                })
                                    .then(function (newRoom) {
                                        done(newRoom);
                                    });
                            } else {
                                console.log("on a trouvé")
                                done(newRoom);
                            }
                        }
                    );
                }else {
                    const newRoom =  roomFound;
                    done(newRoom);
                }
            },
        ], function (newRoom) {
            if (newRoom) {
                rommId = newRoom._id;
                console.log("room id ", rommId);
                socket.join(rommId);
                privateRoom.findOne({
                        UserIdSender: userIdSender,
                        UserIdReciver: userIdReciver
                    }
                )
                    .then(function (newRoom) {
                        if(newRoom){
                            socket.username = newRoom.UserIdSender;
                        }else {
                            socket.username = newRoom.UserIdReciver
                        }
                    });
                privateRoom.findOne({
                        UserIdSender: userIdReciver,
                        UserIdReciver: userIdSender
                    }
                )
                    .then(function (newRoom) {
                        if(newRoom){
                            socket.username = newRoom.UserIdReciver
                        }else {
                            socket.username = newRoom.UserIdSender;
                        }
                    });
                console.log(' joined the room : ', rommId);
                socket.room = rommId;
                return newRoom;
            }
        });
      });
    console.log('New user connected');
    /******************************************************************************************************************/
    socket.username = "Anonymous"
    socket.on('new_message', (data) => {
        //broadcast the new message
        console.log("socket room", socket.room, socket.username);
        io.in(socket.room).emit('new_message', {message: data.message, username: socket.username});
        // io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.in(socket.room).emit('typing', {username: socket.username})
    })
})
