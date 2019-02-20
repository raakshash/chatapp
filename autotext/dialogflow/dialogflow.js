"use strict";

const dialogflow = require('dialogflow');
var uuid = require('uuid');

class Dialogflow {
    constructor() {
        const projectID = 'mychatbot-c5a84';
        const sessionId = uuid.v4();
        this.languageCode = 'en-US';
        const config = {
            credentials: {
                private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
                client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
            }
        }
        this.sessionClient = new dialogflow.SessionsClient(config);
        this.sessionPath = this.sessionClient.sessionPath(projectID, sessionId);
    }
    getInteractiveMessage(iMessageContent) {
        const request = {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: iMessageContent,
                    languageCode: this.languageCode,
                },
            },
        };
        return this.sessionClient
            .detectIntent(request)
            .then(responses => {
                let result = [];
                responses.forEach(function (iResponse) {
                    if (iResponse != undefined) {
                        let reply = [];
                        if (iResponse.queryResult.fulfillmentText != "") {
                            reply.push(iResponse.queryResult.fulfillmentText);
                        }
                        let intent = "";
                        if (iResponse.queryResult.intent != undefined) {
                            intent = iResponse.queryResult.intent.displayName;
                        }
                        let action = iResponse.queryResult.action;
                        if (reply.length > 0) {
                            result.push({
                                intent: intent,
                                reply: reply,
                                action: action
                            });
                        }
                    }
                });
                return result;
            })
            .catch(function (err) {
                console.error('ERROR:', err);
            });
    }
};

module.exports = new Dialogflow();