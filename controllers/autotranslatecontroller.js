const path = require('path');
const request = require('request');
const logger = require('winston');
const User = require('../model/usermodel');
const userService = require('../service/userservice');
const translateService = require('../service/translateservice');
const slackApiService = require('../service/slackapiservice');


module.exports = function (req, res) {
    //TODO: Verify against SLACK_VERIFICATION_TOKEN to make sure the request actually coming from Slack.

    let userId = req.body.user_id;
    let channelId = req.body.channel_id;
    let originalMessage = req.body.text;
    let userData;

    userService.getUser(userId)
        .then(function(data) {
            userData = data;
            return translateService.translate(originalMessage);
        })
        .then(function(translation) {
            logger.info(`Text: ${originalMessage}`);
            logger.info(`Translation: ${translation}`);
            logger.info(`senging message for token ${userData.accessToken}. channel = ${channelId}, Original = ${originalMessage}, translation = ${translation}`);
            return postMessagePOST(userData.accessToken, channelId, originalMessage, translation);    
        })
        .catch(function(err) {
            logger.info(err);
        });

    //Empty response so we don't get timeout error.
    res.json();
};


function postMessagePOST (accessToken, channelId, originalMessage, translation) {
    let form = {
        response_type: 'ephemeral',
        attachments: JSON.stringify([
            {
                text: translation,
                color: "#3AA3E3",
                footer: "Yakusu",
                footer_icon: "https://platform.slack-edge.com/img/default_application_icon.png",
                // ts: Math.floor(Date.now() / 1000)
            }
        ]),
        as_user: true
    };

    return slackApiService.chatPostMessage(accessToken, channelId, originalMessage, form);
}