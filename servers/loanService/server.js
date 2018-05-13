'use strict';

var Hapi = require('hapi');
var Swaggerize = require('swaggerize-hapi');
var Path = require('path');

var mongoose = require('mongoose');
var db
mongoose.connect('mongodb://localhost/test', function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
   db = mongoose.connection
 
});

var Server = new Hapi.Server();

Server.connection({
    port: 8000
});

Server.register({
    register: Swaggerize,
    options: {
        api: Path.resolve('./config/swagger.yaml'),
        handlers: Path.resolve('./handlers')
    }
}, function () {
    Server.start(function () {
        Server.plugins.swagger.setHost(Server.info.host + ':' + Server.info.port);
        /* eslint-disable no-console */
        console.log('App running on %s:%d', Server.info.host, Server.info.port);
        /* eslint-disable no-console */
    });
});
