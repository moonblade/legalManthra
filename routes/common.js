var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    indexName = "legal_manthra",
    caseType = "case",
    basicAuth = require('basic-auth'),
    debug = require('debug')('common'),
    constant = require('../config/constants')

var authenticateadmin = function(req, res, next) {
    unauthorized = function(err) {
        return res.status(401).send({
            "message": "Unauthorized access" + (err ? " - " + err : "")
        });
    }
    debug("req.body")
    debug(req.body)
    if (req.body.user == null)
        return unauthorized()
    elastic.getUser(req.body.user, function(err, result) {
        if (err)
            return unauthorized(err);
        debug(result)
        if (result.found && (result._source.role >= constant.admin))
            return next();
        return unauthorized();
    })
}

router.post('/login', function(req, res, next) {
    elastic.addUser(req.body, function(error, result) {
        res.send({
            "message": "Success"
        });
    })
})
router.post('/editUser', authenticateadmin, function(req, res, next) {
    elastic.editUser(req.body.editUser, req.body.newRole, function(error, result) {
        debug(error)
        if (error)
            return res.status(error.status).send({
                "message": "Error " + error.reason
            })
        debug(result);
        res.send({
            "message": "Success"
        })
    })
})
module.exports = router
