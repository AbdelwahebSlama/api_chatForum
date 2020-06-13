
var app = require('express')()
var server = require('http').Server(app);
var io = require('socket.io').listen(server)
 module.exports = {
socketPost: (req, res, next) =>{
  console.log('   ');

io.on('connection', (socket) => {

    console.log('new connection made.');


    socket.on('join', function(data){
      //joining
      socket.join(data.room);

      console.log(data.user + 'joined the room : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
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
      io.in(data.room).emit('new post', {user:data.user, message:data.message});
    })
});
return res.json({ 'socket': ' post message' });
}
}
 