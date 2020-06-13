var express = require('express');
var usersCtrl = require('./routes/user');
var postsCtrl = require('./routes/posts');
var msgCtrl = require('./routes/msgCtrl');
var msgPriveeCtrl = require('./routes/privateCtrl');
var msgFilsCtrl = require('./routes/messageFilsCtrl');
var groupCtrl = require('./routes/groupeCtrl');
var likesCtrl = require('./routes/likeCtrl');
var socket = require('./routes/socketCtrl');
var upload = require('./routes/upload');

//Routes
exports.router = (function () {
    var apiRouter = express.Router();

    //Users routes
    apiRouter.route('/').get(socket.socketPost);
    apiRouter.route('/users/registre/').post(usersCtrl.register);
    apiRouter.route('/users/login/:groupId/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);

    //group
    apiRouter.route('/group/registre/').post(groupCtrl.register);
    apiRouter.route('/group/get/').get(groupCtrl.getGroup);
    apiRouter.route('/group/getById/:groupId').get(groupCtrl.getGroupPerId);
    apiRouter.route('/group/:user/update/').put(groupCtrl.updateGroup);

    // Messages routes
    apiRouter.route('/messages/new/').post(msgCtrl.createMessage);
    apiRouter.route('/messages/:groupId/').get(msgCtrl.listMessages);

    // Messages privee routes
    apiRouter.route('/messages/newMsg/').post(msgPriveeCtrl.createMessage);
    apiRouter.route('/messagesPrivee/').get(msgPriveeCtrl.listMessages);

    // Messages Fils routes
    apiRouter.route('/messages/newMsgFils/:messageId/').post(msgFilsCtrl.createMessage);
    apiRouter.route('/messagesFils/').get(msgFilsCtrl.listMessages);

    //Upload
    apiRouter.route('/upload/upload').post(upload.upload);

    //routes likes
    apiRouter.route('/messages/vote/like/:messageId').post(likesCtrl.likePost);
    apiRouter.route('/messages/:messageId/vote/dislike').post(likesCtrl.dislikePost);

    //apiRouter.route('/p').get(postsCtrl.regitre);
    apiRouter.route('/p/:id').get(postsCtrl.rech);
    apiRouter.route('/p/:id').delete(postsCtrl.delete);
    apiRouter.route('/p/c/').post(postsCtrl.create);


    return apiRouter;

})();
