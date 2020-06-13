
const mongoose = require('mongoose');
var mongooseemailvalidator = require('mongoose-unique-validator');

const messageFilsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    datecreation: {
        type: Date,
        required: true,
        default: Date.now
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    username: {
        type: String
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'message'
    }

  //  postId: {
    //    type: mongoose.Schema.Types.ObjectId, 
       // ref: 'Post'
    //}

});


module.exports = mongoose.model('messageFils', messageFilsSchema);
