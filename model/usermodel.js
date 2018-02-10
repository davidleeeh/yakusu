const mongoose = require('mongoose');
    
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userId: String,
    accessToken: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;