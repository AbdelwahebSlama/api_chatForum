const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
  
    
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'message'
    },
    islike: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('like', LikeSchema);
