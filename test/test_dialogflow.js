var expect = require('chai').expect;
if (process.env.NODE_ENV != "production") {
    require('dotenv').config({
      path: 'variables.env'
    });
  }
const Dialogflow = require('../autotext/index.js').Dialogflow;


describe('Reply of hi ', function () {
    it('should be a greeting message', function () {
        Dialogflow.getInteractiveMessage('hi').then(function(iResults){
            iResults.forEach(function(iRes){
                expect(iRes.reply.length).to.greaterThan(0);
            });
        });
        expect()
    });
});