var bcrypt = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var models    = require('../models/groupe');
var user   = require('../models/user');
var asyncLib  = require('async');

// Constants

const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;
//Routes
module.exports = {
      register: async (req, res, next) =>{
   
 // Getting auth header
 var headerAuth  = req.headers['authorization'];
 var userId      = jwtUtils.getUserId(headerAuth);

 // Params
 var nomGroup    = req.body.nomGroup;
 var description = req.body.description;
   // var createBy = req.body.createBy;

 if (nomGroup == null || description == null ) {
   return res.status(400).json({ 'error': 'missing parameters' });
 }

 if (nomGroup.length <= TITLE_LIMIT || description.length <= CONTENT_LIMIT) {
   return res.status(400).json({ 'error': 'invalid parameters' });
 }
 console.log(userId);
 asyncLib.waterfall([
   function(done) {
     user.findOne(
      {_id: userId})
     .then(function(userFound) {
       done(null, userFound);
       console.log("hello word");
       console.log(userFound.id);
     })
     .catch(function(err) {
       return res.status(500).json({ 'error': 'unable to verify user' });
     });
   },
   function(userFound, done) {
     if(userFound) {
       models.create({
         nomGroup  : nomGroup,
         description: description,
         UserId : userFound.id
       })
       .then(function(newGroup) {
         console.log(newGroup);
         done(newGroup);
       });
     } else {
       res.status(404).json({ 'error': 'user not found' });
     }
   },
 ], function(newGroup) {
   if (newGroup) {
     console.log(newGroup);
     return res.status(201).json(newGroup);
   } else {
     return res.status(500).json({ 'error': 'cannot create groupe' });
   }
 });
  },
  getGroup: async (req, res, next) =>{
    // Getting auth header
    /**
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);*/

    /**if (userId == null)
      return res.status(400).json({ 'error': 'wrong token' });
  console.log(userId)*/
    models.find(
    ).then(function(groupe) {
      if (groupe) {
        res.status(201).json(groupe);
      } else {
        res.status(500).json({ 'error': 'liste de groupe vide ' });
      }
    }).catch(function(err) {
      res.status(404).json({ 'error': ' probléme de connexion' });
    });
  },
  getGroupPerId: async (req, res, next) => {
    // Getting auth header
    var groupId = req.params.groupId;
    models.findOne(
        {_id: groupId}
    ).then(function (group) {
      if (group) {
        res.status(201).json(group);
      } else {
        res.status(404).json({'error': 'group not found'});
      }
    }).catch(function (err) {
      res.status(500).json({'error': 'cannot fetch group'});
    });
  },
  updateGroup: async (req, res, next) =>{
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    var nomGroup    = req.body.nomGroup;
    var description = req.body.description;
    var user = req.params.user;
    if (user == null) {
        console.log(user)
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
    asyncLib.waterfall([
      function(done) {
        models.findOne(
            { _id: user }
        ).then(function (userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
            console.log(userFound)
          userFound.update({
            nomGroup: (nomGroup ? nomGroup : userFound.nomGroup),
            description: (description ? description : userFound.description)

          }).then(function() {
            done(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update group' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update group' });
      }
    });
  }
}
