"use strict";
const mongoose = require('mongoose');

exports.init = function(){
    const dbURL = "mongodb://localhost:27017/chat-data";
    mongoose.connect(dbURL);
    mongoose.connection.on("connected",function(){
        console.log("app connected to mongodb @ 27017");
    });
    
    mongoose.connection.on("error",function(err){
        console.log("app connection fail :"+err);
    });
};