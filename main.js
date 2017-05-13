var Client = require('node-rest-client').Client; // https://www.npmjs.com/package/node-rest-client
var googleTTS = require('google-tts-api');
var prompt = require('prompt'); // https://www.npmjs.com/package/prompt
var config = require('./config');

var client = new Client();


var toAudio = function (textToSay) { // Returns an URL .mp3 : https://translate.google.com/translate_tts?...
    googleTTS(textToSay, config.googletts.lang, config.googletts.pitch)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      console.log(url);
    })
    .catch(function (err) {
      console.error(err.stack);
    });
};

// Test single query
prompt.start();
var queryToSend;
prompt.get(['query'], function (err, result) {
    queryToSend = result.query;

    var args = {
        parameters: { v: "10/05/2017", q: queryToSend }, // TODO: replace with current date
        headers: { "Authorization": config.witai.authorization }
    };

    client.registerMethod("queryAI", config.witai.url, "GET");

    client.methods.queryAI(args, function (data, response) {
        // parsed response body as js object
        console.log(data.entities);

        if (!data.entities || !data.entities.intent || data.entities.intent.length == 0) {
            var botAnswer = "I don't understand your request!"
            console.log(botAnswer);
            toAudio(botAnswer);
            return;
        }

        var intents = data.entities.intent;

        switch(intents[0].value) {
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


    });
});
