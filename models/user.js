"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", UserSchema);
module.exports = User;