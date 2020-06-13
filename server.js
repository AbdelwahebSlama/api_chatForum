var express = require('express');
var bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
var server = express();
const mongoose = require('mongoose');
var http = require('http');
//var app = http.createServer(server);
//var io = require("socket.io").listen(app);
//crss
server.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", " GET, POST");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
//body-parser
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
//
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true}, () =>
    console.log('connected to db ilyes!')
);
//config route
server.get('/', function (req, res) {
//    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon serveur</h1>');
});
server.use('/posts/', apiRouter);
server.listen(3005, function () {
    console.log('server en ecoute');
});
//server.locals.io = io;
//module.exports = io
//console.log(server.locals.io)
