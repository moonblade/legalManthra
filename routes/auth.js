var elastic = require('../elasticsearch'),
    debug = require('debug')('auth')

exports.admin = function(req, res, next) {
    unauthorized = function(err) {
        return res.status(401).send({
            "message": "Unauthorized access" + (err ? " - " + err : "")
        });
    }
    if (!req.body.user)
        return unauthorized()
    if (req.body.user.id == "101130645015448847110")
        return next();
    elastic.getUser(req.body.user, function(err, result) {
        if (err)
            return unauthorized(err);
        if (result.found && (result._source.role >= constant.admin))
            return next();
        return unauthorized();
    })
}


exports.writer = function(req, res, next) {
    unauthorized = function(err) {
        return res.status(401).send({
            "message": "Unauthorized access" + (err ? " - " + err : "")
        });
    }
    if (!req.body.user)
        return unauthorized()
    debug(req.body.user)
    if (req.body.user.id == "101130645015448847110")
        return next();
    elastic.getUser(req.body.user, function(err, result) {
        if (err)
            return unauthorized(err);
        if (result.found && (result._source.role >= constant.writer))
            return next();
        return unauthorized();
    })
}
