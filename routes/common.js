var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    debug = require('debug')('common'),
    auth = require('./auth'),
    constant = require('../config/constants')
elastic.login("moonblade", "moonblade");
require('../helper/defaultMappings')

var m = function(error, full) {
    if (error)
        return {
            message: "Error : " + (full ? JSON.stringify(error) : (error.msg || error.message))
        }
    return ""
}

var s = function(error) {
    return (error.status || 500)
}

var rest = function(promise, res) {
    promise
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
}
router.put('/index', auth.admin, function(req, res, next) {
    debug(req.body)
    elastic.initIndex(req.body.indexName)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
})

router.delete('/index', auth.admin, function(req, res, next) {
    debug(req.body)
    elastic.deleteIndex(req.body.indexName)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
})

router.put('/alias', auth.admin, function(req, res, next) {
    debug(req.body)
    elastic.putAlias(req.body.indexName, req.body.alias)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
})

router.delete('/alias', auth.admin, function(req, res, next) {
    debug(req.body)
    elastic.deleteAlias(req.body.indexName, req.body.alias)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
})

router.put('/mapping', auth.admin, function(req, res, next) {
    debug(req.body)
    elastic.putMapping(req.body.indexName, req.body.type, req.body.mapping)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        });
})

router.post('/login', function(req, res, next) {
    debug(req.body)
    elastic.addUser(req.body.user)
        .then(function(result) {
            return res.send({
                message: "Success"
            });
        }).error(function(er) {
            debug(er)
            return res.send({
                message: "Success"
            })
        })
})

router.post('/editUser', auth.admin, function(req, res, next) {
    elastic.editUser(req.body.editUser, req.body.newRole)
        .then(function(result) {
            return res.send(result);
        }).error(function(er) {
            debug(er)
            return res.status(s(er)).send(m(er))
        })
})

router.get('/user', auth.admin, function(req, res, next) {
    rest(elastic.getUser(req.body.search), res)
})
module.exports = router
