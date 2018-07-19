'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var path = require('path');
var app = require('express')();
var config = require("./config/mongoConfig");
var mongoose = require('mongoose');
mongoose.connect("mongodb://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database);

mongoose.set('debug', true);

module.exports = app; // for testing
app.use(express.static(path.join(__dirname, 'dist')));

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // enable SwaggerUI
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());
  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
