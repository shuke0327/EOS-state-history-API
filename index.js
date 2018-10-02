/*###############################################################################
#
# EOS Mongo History API
# API to get actions using EOS mongo plugin (similar to history plugin)
#
# Examples:
# http://history.cryptolions.io/v1/history/get_actions/cryptolions1
# http://history.cryptolions.io/v1/history/get_actions/cryptolions1/sethash
# http://history.cryptolions.io/v1/history/get_actions/cryptolions1/sethash?limit=2&skip=1&sort=-1
#
# Git Hub: https://github.com/CryptoLions/EOS-mongo-history-API
#
# Created by http://CryptoLions.io
#
###############################################################################  */
require('appmetrics-dash').monitor();
const MongoClient 	= require('mongodb').MongoClient;
const swaggerJSDoc 	= require('swagger-jsdoc');
const bodyparser 	= require('body-parser');
const CONFIG		= require('./config.js');

const swaggerSpec = swaggerJSDoc({
  definition: {
    info: {
      title: 'EOS history API by Cryptolions',
      version: '1.0.0',
    },
  },
  apis: ['./api/v1.api.history.js'],
});

const express 		= require('express');
const app 			= express();
app.use(bodyparser.json({
  strict: false,
}));
app.use('/', express.static(__dirname + '/html'));


process.on('uncaughtException', (err) => {
    console.error(`======= UncaughtException API Server :  ${err}`);
});

MongoClient.connect( CONFIG.mongoURL, (err, db) => {
		if (err){
			return console.error("Database error !!!", err);
		}
        console.log("=== Database Connected!");
        let dbo = db.db(CONFIG.mongoDB);
		require('./api/v1.api.history')(app, dbo, swaggerSpec);        
});

const http 	= require('http').Server(app);
http.listen(CONFIG.serverPort, () => {
  	 console.log('=== Listening on port:', CONFIG.serverPort);
});
http.on('error', (err) => {
	 console.error('=== Http server error', err);
});
