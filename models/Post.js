const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }
});

module.exports = mongoose.model('Post', PostSchema);
