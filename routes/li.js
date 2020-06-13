// Imports
var models   = require('../models/like');
var msg   = require('../models/message');
var user    = require('../models/user');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  
  likePost: async (req, res, next) =>{
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
   
    var messageId = req.params.messageId;
    if (messageId == null) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        msg.findOne(
          {_id: messageId }
        )
        .then(function(messageFound) {
          done(null, messageFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(messageFound, done) {
        if(messageFound) {
          user.findOne(
               {_id: userId }
          )
          console.log(userFound)
          .then(function(userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(messageFound, userFound, done) {
        if(userFound) {
          models.find({
              userId: userId,
              messageId: messageId
            }
          )
          .then(function(userAlreadyLikedFound) {
              console.log(userAlreadyLikedFound)
            done(null, messageFound, userFound, userAlreadyLikedFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          });
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      function(messageFound, userFound, userAlreadyLikedFound, done) {
        if(!userAlreadyLikedFound) {

          messageFound.addUser(userFound, { isLike: LIKED })
          .then(function (alreadyLikeFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to set user reaction' });
          });
        } else {
          if (userAlreadyLikedFound.isLike === DISLIKED) {
            userAlreadyLikedFound.update({
              isLike: LIKED,
            }).then(function() {
              done(null, messageFound, userFound);
            }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot update user reaction' });
            });
          } else {
            res.status(409).json({ 'error': 'message already liked' });
          }
        }
      },
      function(messageFound, userFound, done) {
        messageFound.update({
          likes: messageFound.likes + 1,
        }).then(function() {
          done(messageFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });
      },
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },
  dislikePost: async (req, res, next) =>{
   // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var userId      = jwtUtils.getUserId(headerAuth);

   // Params
   var messageId = req.params.messageId;

   if (messageId == null) {
     return res.status(400).json({ 'error': 'invalid parameters' });
   }

   asyncLib.waterfall([
    function(done) {
       msg.findOne({
          _id: messageId 
       })
       .then(function(messageFound) {
         done(null, messageFound);
       })
       .catch(function(err) {
         return res.status(500).json({ 'error': 'unable to verify message' });
       });
     },
     function(messageFound, done) {
       if(messageFound) {
         user.findOne({
           _id: userId 
         })
         .then(function(userFound) {
           done(null, messageFound, userFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify user' });
         });
       } else {
         res.status(404).json({ 'error': 'post already liked' });
       }
     },
     function(messageFound, userFound, done) {
       if(userFound) {
         models.findOne({
           
             userId: userId,
             messageId: messageId
           
         })
         .then(function(userAlreadyLikedFound) {
            done(null, messageFound, userFound, userAlreadyLikedFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify is user already liked' });
         });
       } else {
         res.status(404).json({ 'error': 'user not exist' });
       }
     },
     function(messageFound, userFound, userAlreadyLikedFound, done) {
      if(!userAlreadyLikedFound) {
        messageFound.addUser(userFound, { isLike: DISLIKED })
        .then(function (alreadyLikeFound) {
          done(null, messageFound, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to set user reaction' });
        });
      } else {
        if (userAlreadyLikedFound.isLike === LIKED) {
          userAlreadyLikedFound.update({
            isLike: DISLIKED,
          }).then(function() {
            done(null, messageFound, userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user reaction' });
          });
        } else {
          res.status(409).json({ 'error': 'message already disliked' });
        }
      }
     },
     function(messageFound, userFound, done) {
       messageFound.update({
         likes: messageFound.likes - 1,
       }).then(function() {
         done(messageFound);
       }).catch(function(err) {
         res.status(500).json({ 'error': 'cannot update message like counter' });
       });
     },
   ], function(messageFound) {
     if (messageFound) {
       return res.status(201).json(messageFound);
     } else {
       return res.status(500).json({ 'error': 'cannot update message' });
     }
   });
  }
  
}