
const mongoose = require('mongoose');
// var mongooseemailvalidator = require('mongoose-unique-validator');

const privateRoomSchema = mongoose.Schema({

    datecreation: {
        type: Date,
        // required: true,
        default: Date.now
    },
    UserIdSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    UserIdReciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});
module.exports = mongoose.model('privateRoom', privateRoomSchema);
