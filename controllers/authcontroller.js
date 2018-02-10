const path = require('path');
const request = require('request');
const logger = require('winston');
const User = require('../model/usermodel');
const slackApiService = require('../service/slackapiservice');
const userService = require('../service/userservice');


module.exports = (req, res) => {
    if(!req.query.code) {
        res.end('This request does not come from slack');
    } else {

        slackApiService.oauthAccess(req.query.code)
        .then(function(results) {
            let bodyObj = JSON.parse(results.body); 
            let token = bodyObj.access_token;
            let userId = bodyObj.user_id;

            logger.info('Received token = ' + token);
            logger.info(bodyObj);

            userService.createUser(userId, token)
            .then(function() {
                logger.info(`User ${userId} successfully created!`);
            })
            .catch(function(err) {
                logger.info(`Error creating user ${userId}`, err);
            });

            return token;
        })
        .then(function(token) {
            return slackApiService.teamInfo(token);
        })
        .then(function(results) {
            let bodyObj = JSON.parse(results.body);
            res.redirect('http://' + bodyObj.team.domain + '.slack.com');
        })
        .catch(function(err) {
            console.error('Error occurred during auth: ', err);
        });
    }
};