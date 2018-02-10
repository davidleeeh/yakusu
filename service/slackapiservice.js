`use strict`;

const request = require('request');

function asyncGet(requestData) {
    return new Promise(function(resolve, reject) {
        request.get(requestData, (error, response, body) => {
            if(!error && response.statusCode === 200) {
                return resolve({response: response, body: body});
            } else {
                reject(error);
            }
        });
    });
}

function asyncPost(uri, options) {
    const defaults = {
        auth: {},
        form: {}
    };

    options = Object.assign(defaults, options);

    return new Promise(function(resolve, reject) {
        request.post(uri, options, (error, response, body) => {
            if(!error && response.statusCode === 200) {
                resolve({response: response, body: body});
            } else {
                reject(err);
            }
        });
    });
}

function oauthAccess(authCode) {
    let authRequestData = {
        uri: 'https://slack.com/api/oauth.access',
        qs: {
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code: authCode
        }
    };

    return asyncGet(authRequestData);
}

function teamInfo(accessToken) {
    let teamInfoRequestData = {
        uri: 'https://slack.com/api/team.info',
        qs: {
            token: accessToken
        }
    };

    return asyncGet(teamInfoRequestData);
}

function chatPostMessage(accessToken, channelId, text, formOptions) {
    const endPointUri = 'https://slack.com/api/chat.postMessage';

    let defaultFormOptions = {
        channel: channelId,
        response_type: 'ephemeral',
        text: text,
    };

    formOptions = Object.assign(defaultFormOptions, formOptions);

    let options = {
        auth: {
            bearer: accessToken
        },
        form: formOptions
    };

    return asyncPost(endPointUri, options);
}

module.exports = {
    chatPostMessage,
    oauthAccess,
    teamInfo
};