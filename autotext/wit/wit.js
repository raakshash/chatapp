"use strict";

const wit = require('node-wit').Wit;
var Replies = require('../../models/replies.js');

class Wit {
    constructor() {
        this.client = new wit({
            accessToken: process.env.WIT_ACCESS_TOKEN
        });
    }
    getInteractiveMessage(iMessageContent) {
        return this.client.message(iMessageContent, {})
            .then((data) => {
                var userIntent = [];
                if (data.entities.intent !== undefined) {
                    data.entities.intent.forEach(function (iUserIntent) {
                        userIntent.push(iUserIntent.value);
                    });
                } else {
                    userIntent.push("dont_understand");
                }
                return findIntentData(userIntent);
                // data = JSON.stringify(data);
                // console.log(data);
            });
    }
    findIntentData(iUserIntent) {
        return Replies.find({
            'intent': iUserIntent
        }, function (err, iReply) {
            if (err) {
                return console.error("Error: " + err);
            }
            if (iUserIntent.length !== iReply.length) {
                for (let i = 0; i < iUserIntent.length; i++) {
                    if (iReply[i] === undefined || iReply[i] != undefined && iUserIntent[i] !== iReply[i].intent) {
                        var newReply = new Replies();
                        newReply.intent = iUserIntent;
                        newReply.reply = [];
                        newReply.save(function (err) {
                            if (err) {
                                console.error("Error: " + err);
                            }
                        });
                    }
                }
            }
            if (iReply.length > 0) {
                return iReply;
            }
        });
    };
};

module.exports = new Wit();
