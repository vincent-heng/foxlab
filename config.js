var config = {};

config.foxlab = {};
config.witai = {};
config.googletts = {};
config.log = {};

config.foxlab.port = 3000;

config.witai.messageurl = 'https://api.wit.ai/message';
config.witai.speechurl = 'https://api.wit.ai/speech';
config.witai.authorization = "PUT YOUR KEY HERE";
config.log.level = 'debug';

config.googletts.lang = "en";
config.googletts.pitch = 1;

module.exports = config;
