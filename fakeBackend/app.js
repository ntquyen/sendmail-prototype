var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');
var mandrill = require('./routes/mandrill');

var app = express();
var clientPath = path.resolve(__dirname, '..', 'build');
app.set('views', clientPath);
app.use(express.static(clientPath));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
//...............
// Start of API
var baseUrl = '/api';
app.get('/', routes.index);
app.post(baseUrl + '/sendmail', mandrill.sendmail);
// End of API
//.......................
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var debug = require('debug')('my-applicationag');
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

module.exports = app;