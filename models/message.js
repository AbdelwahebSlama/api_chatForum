
const mongoose = require('mongoose');
var mongooseemailvalidator = require('mongoose-unique-validator');

const messageSchema = mongoose.Schema({
    title: {
        type: String,
        //required: true
    },
    content: {
        type: String,
       // required: true
    },
    likes: {
        type: Number,
        //required: true
    },
    datecreation: {
        type: Date,
        // required: true,
        default: Date.now
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    username: {
      type: String
    },
    groupId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'groupe'

    },
    comments: [  ] 
  //  postId: {
    //    type: mongoose.Schema.Types.ObjectId, 
       // ref: 'Post'
    //}

});


module.exports = mongoose.model('message', messageSchema);
