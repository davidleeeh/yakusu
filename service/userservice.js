const logger = require('winston');

const User = require('../model/usermodel');

let _cache = {
    _src: {},
    has: function(key) {
        return this._src.hasOwnProperty(key);
    },
    get: function(key) {
        return this._src[key];
    },
    add: function(key, data) {
        this._src[key] = data;
    }
};

/**
 * 
 * @param {*} userId 
 */
function getUser(userId) {
    if (_cache.has(userId)) {
        return Promise.resolve(_cache.get(userId));
    }

    return new Promise(function(resolve, reject) {
        User.find({userId: userId}, (err, docs) => {
            if (err) {
                reject(err);
            }

            if(docs.length > 0) 
            {
                let userData = docs[0];
                _cache.add(userData.userId, userData);
                resolve(userData);
            } else {
                reject(new Error(`No access token for user ${userId}`));
            }
        });
    });
}

function createUser(userId, accessToken) {
    if (!userId) {
        return Promise.reject(new Error('Unable to save user data without user ID'));
    }

    if (!accessToken) {
        return Promise.reject(new Error('Unable to save user data without access token'));
    }

    return new Promise(function(resolve, reject) {
        const query = {userId: userId};
        const data = {
            userId: userId,
            accessToken: accessToken
        };
        const options = {
            new: true,
            upsert: true
        }

        User.findOneAndUpdate(
            query, 
            data, 
            options,
            function(err, data) {
                if(err) {
                    reject(err);
                    return;
                }

                // Caching user data so we don't have to make 
                // DB query for every request.
                _cache.add(data.userId, data);
                resolve(data);
            });
    });
}

module.exports = {
    createUser,
    getUser
}