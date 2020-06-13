
const mongoose = require('mongoose');
var mongooseemailvalidator = require('mongoose-unique-validator');

const groupSchema = mongoose.Schema({
    nomGroup: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
    membre: []
  //  postId: {
    //    type: mongoose.Schema.Types.ObjectId, 
       // ref: 'Post'
    //}

});


module.exports = mongoose.model('groupe', groupSchema);
