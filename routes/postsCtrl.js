
var models   = require('../models/Post');

var async = require('async');
var jwtUtils = require('../utils/jwt.utils');


module.exports = {

    createMessage: async function(req, res){
        try{
            const findPost = await Post.find();
            res.json(findPost);
        }catch(err){
            res.json({message: err}); 
        }
       }
          
}