var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    indexName = "legal_manthra",
    caseType = "case",
    basicAuth = require('basic-auth'),
    debug = require('debug')('common'),
    auth = require('./auth')
    constant = require('../config/constants')

router.post('/login', function(req, res, next) {
    elastic.addUser(req.body, function(error, result) {
        res.send({
            "message": "Success"
        });
    })
})
router.post('/editUser', auth.admin, function(req, res, next) {
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
