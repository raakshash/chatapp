var mongoose = require('mongoose');

var UserReplySchema = mongoose.Schema({
    intent: {
        type: String,
        required: true
    },
    reply:{
        type: String
    }
});

var Replies = mongoose.model("Replies", UserReplySchema);

module.exports = Replies;