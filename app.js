'use strict';
// Imports
var models   = require('./models/message');
var userM   = require('./models/user');
var like   = require('./models/like');
var asyncLib = require('async');
const  mongoose = require('mongoose');
var jwtUtils = require('./utils/jwt.utils');
// import Module
const express = require('express')
const app = express()

const TITLE_LIMIT   = 0;
const CONTENT_LIMIT = 0;
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true},()=>
console.log('connected to db ilyes!'));
//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
const server = app.listen(3007)

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection',(socket)=>{

  console.log('new connection made.');

  socket.on('join', function(data){
    //console.log(data.room);
    //joining
    socket.join(data.room);
    console.log(data.user + '  joined the room :  ' + data.room);
    //socket.broadcast.to(data.room).emit('new user joined', {user: data.user, message: ' has joined this room'});
    socket.broadcast.to(data.room).emit('new user joined', {message: data.user, user: ' has joined this room.'});
  });


  socket.on('leave', function(data){
  
    console.log(data.user + 'left the room : ' + data.room);

    socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

    socket.leave(data.room);
  });

  socket.on('message',function(data){
console.log(data.room)
    io.in(data.room).emit('new message', {user:data.user, message:data.message, room: data.room});
  })
socket.on('post',function(data){
console.log(data.room)
    io.in(data.room).emit('new post', {user:data.user, message:data.message, comment:data.comment});
  })
});