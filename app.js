var express = require('express'),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    cases = require('./routes/cases'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth2').Strategy,
    GOOGLE_CLIENT_ID = "596155870082-1b23ddnvjc4qpa5aisbvuk8sb233pv4l.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET = "1FkxzjH0edFp23VqpvkO2gLR",
    app = express();

// view engine setup
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var whitelist = [config.serverUrl, 'https://accounts.google.com', null];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials:true
};
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '500mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "legal_manthra",
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: config.serverUrl + "/oauth2callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }
));
passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

app.get('/oauth2callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.use('/cases', cases);

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
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
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
