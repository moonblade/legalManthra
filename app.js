var express = require('express'),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cases = require('./routes/cases'),
    common = require('./routes/common'),
    session = require('express-session'),
    app = express();

// view engine setup
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public/production/')));
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '500mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "legal_manthra",
    resave: true,
    saveUninitialized: true
}));

app.use('/cases', cases);
app.use('', common);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (!res._headerSent) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    }
});

// var elastic = require('./elasticsearch');
// caseIndex = "case";
// var init = function(index) {
//     elastic.indexExists(index).then(function(exists) {
//         if (!exists) {
//             return elastic.initIndex(index).then(function() {
//                 elastic.initMapping(index)
//             });
//         }
//     });
// }
// init(caseIndex);


module.exports = app;
