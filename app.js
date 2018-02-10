'use strict';

// TODO: Each user has a different access token. We might need to store them somewhere.
// 

 /**
  * Note for myself
  * 
  * Used ngrok (https://ngrok.com/) to tunnel local host to a public ip
  * Used now (https://zeit.co/now) for real deployment.
  */
 //Not a very ideal way to allow modules to access base dir.
 global.__baseDir = __dirname + '/';

const dbConfig = require('./dbconfig');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const request = require('request');
const logger = require('winston');
const authController = require('./controllers/authcontroller');
const autoTranslateController = require('./controllers/autotranslatecontroller');
// const translateController = require('./controllers/translateController');
const User = require('./model/usermodel');
const config = require('config');

// logger.info('NODE_CONFIG_ENV = ' + config.util.getEnv('NODE_CONFIG_ENV'));
// logger.info('NODE_CONFIG_DIR = ' + config.util.getEnv('NODE_CONFIG_DIR'));

const app = express();
const port = process.env.port || 8080;


//Load configs from .env file into process.env object.
require('dotenv').config();

//Yep I'm using global variable to store access tokens for users
global.tokenCache = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Handle requests to /assets.
app.use('/assets', express.static(path.join(__dirname, '/public')));

//Handles requests to /views. Currently static html only.
app.use('/views', express.static(path.join(__dirname, '/views')));

//Register auth controller
app.get('/auth', authController);

//Register translate controller
app.post('/', autoTranslateController);

// useMongoClient is required to avoid warning from Mongoose.
const connectOptions = {
    useMongoClient: true
};
mongoose.connect(dbConfig.getDBConnectionString(), connectOptions);

const server = app.listen(port, () => {
    logger.info('Yakusu listening on port %d in %s mode', server.address().port, app.settings.env);
});