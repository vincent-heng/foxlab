'use strict';
module.exports = function(app) {
    var controller = require('../controllers/controller');

    // todoList Routes
    app.route('/v1/bot/text')
        .get(controller.requestByText)

    app.route('/v1/bot/voice')
        .get(controller.requestByVoice)
};
