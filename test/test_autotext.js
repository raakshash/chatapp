var expect = require('chai').expect;
if (process.env.NODE_ENV != "production") {
    require('dotenv').config({
      path: 'variables.env'
    });
  }
const autotext = require('../autotext/index.js');


describe('Reply of hi ', function () {
    it('should be a greeting message', function () {
        autotext.Dialogflow.getInteractiveMessage('hi').then(function(iResults){
            iResults.forEach(function(iRes){
                expect(iRes.reply.length).to.greaterThan(0);
            });
        });
    });
    it('should be a greeting message', function () {
        autotext.Wit.getInteractiveMessage('hi').then(function(iResults){
            iResults.forEach(function(iRes){
                expect(iRes.reply.length).to.greaterThan(0);
            });
        });
    });
});