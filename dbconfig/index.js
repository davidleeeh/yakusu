const config = require('config');

module.exports = {
    getDBConnectionString : function() {
        // let dbConfig = config.get('mongodb');
        const username = process.env.MONGO_DB_USERNAME;
        const password = process.env.MONGO_DB_PASSWORD;
        return 'mongodb://' + username + ':' + password + '@ds247357.mlab.com:47357/yakusu'
    }
};