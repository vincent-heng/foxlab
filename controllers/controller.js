'use strict'

var googleTTS = require('google-tts-api');
var mongoose = require('mongoose');
var log = require('log');
const winston = require('winston');
var fs = require('fs');
var request = require('request');

var config = require('../config');


exports.requestByText = function(req, res) {
    var userRequest = req.query;
    if (!userRequest.query) {
        res.send("Missing query!");
        return;
    }
    var botResult = queryAI(userRequest.query);
    res.send(botResult);
};

exports.requestByVoice = function(req, res) {
  fs.readFile('sample.wav', function(err, data) {
    if (err) {
      winston.error(err);
      return;
    }
    winston.debug(data);
    var botResult = queryAIVoice(data);
    res.send(botResult);
  });
};

/** Bot functions **/

/* Text to Speech with Google translate lib */
var toAudio = function(textToSay) { // Returns an URL .mp3 : https://translate.google.com/translate_tts?...
    googleTTS(textToSay, config.googletts.lang, config.googletts.pitch)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      winston.debug(url);
      return url;
    })
    .catch(function (err) {
        winston.error("TTS error"+err.stack);
    });
};

var queryAIVoice = function(userRequest) {
  fs.readFile('sample.wav', function (err, data) { // TODO sample.wav is just a mock
    if (err) return console.error(err);

    var options = {
      url : config.witai.speechurl,
      body : data,
      headers: {
        "Authorization": "Bearer " + config.witai.authorization,
        "Content-Type": "audio/wav"
      }
    }

    request.post(options, function(err, message, data) {
          if (err) return console.error(err);

          var response;
          var parsedData = JSON.parse(data);

          processBotAnswer(parsedData, response);
    });
  });

}

var queryAI = function(userRequest) {
    var options = {
      url : config.witai.messageurl,
      qs: {q: userRequest },
      headers: {
        "Authorization": "Bearer " + config.witai.authorization,
      }
    }

    request.get(options, function(err, message, data) {
      if (err) return console.error(err);

      var response;
      var parsedData = JSON.parse(data);

      processBotAnswer(parsedData, response);

    });

};

var processBotAnswer = function(data, response) {
    winston.debug(data);
    if (!data.entities) { // TODO handle errors
        var botAnswer = "I'm a little bit confused. Maybe you forgot to specify the authentication key?";
        winston.debug(botAnswer);
        toAudio(botAnswer);
        return;
    }

    winston.debug(data.entities);

    if (!data.entities.intent || data.entities.intent.length == 0) {
        var botAnswer = "I don't understand your request!"
        winston.debug(botAnswer);
        toAudio(botAnswer);
        return;
    }

    var intents = data.entities.intent;

    switch(intents[0].value) { // TODO return the answer in response
        case "repeat_set":
            toAudio("You said: "+data.entities.message_body[0].value);
            break;
        case "repeat_get":
            toAudio("Err... my apologize, I forgot. My database is not implemented yet.");
            break;
        case "greetings":
            toAudio("Hi human!");
            break;
        case "time_get":
            toAudio("I don't have a clock but I'm pretty sure it's late because I'm tired...");
            break;
        case "askweather_get":
            toAudio("I don't have eyes. What about watching through the window?");
            break;
        case "alarmclock_off":
            toAudio("Yeah it was a little bit noisy and irritating. Err, good morning.");
            break;
        case "leavemessage_set":
            toAudio("Ok I'll tell him, count on me... What should I say again?");
            break;
        default:
            toAudio("I understand the request but I don't know what to do with this.");
    }
};
