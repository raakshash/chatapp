"use strict";
const mongoose = require('mongoose');

exports.init = function(){
    const dbURL = process.env.MONGO_DATABASE || "mongodb://localhost:27017/karochat";
    mongoose.connect(dbURL, { useNewUrlParser: true });
    mongoose.connection.on("connected",function(){
        console.log("app connected to mongodb @ 27017");
    });
    
    mongoose.connection.on("error",function(err){
        console.log("app connection fail :"+err);
    });
};