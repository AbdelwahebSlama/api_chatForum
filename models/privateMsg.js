
const mongoose = require('mongoose');
var mongooseemailvalidator = require('mongoose-unique-validator');

const privateMessageSchema = mongoose.Schema({
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
     reciver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }
  //  postId: {
    //    type: mongoose.Schema.Types.ObjectId, 
       // ref: 'Post'
    //}

});


module.exports = mongoose.model('privateMsg', privateMessageSchema );