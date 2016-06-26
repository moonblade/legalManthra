var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    indexName = "legal_manthra",
    caseType = "case",
    basicAuth = require('basic-auth')

router.post('/login', function(req, res, next) {
    elastic.login(req.body.user.name, req.body.user.password);
    res.send({"message":"Success"});
})

router.post('/logout', function(req, res, next) {
    elastic.initAnon();
    res.send({"message":"Success"});
})

module.exports = router