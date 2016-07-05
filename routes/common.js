var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    basicAuth = require('basic-auth'),
    debug = require('debug')('common'),
    auth = require('./auth'),
    constant = require('../config/constants')

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
            return res.send({message:"Success"});
        }).error(function(er) {
            debug(er)
            return res.send({message:"Success"})
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

module.exports = router


// Default Mappings
elastic.putMapping(constant.caseIndex + "_v" + constant.version, constant.caseType, {
    "properties": {
        "type": {
            "type": "string",
            "analyzer": "english"
        },
        "longDescription": {
            "type": "string",
            "analyzer": "english"
        },
        "dateOfDecision": {
            "type": "date"
        },
        "courtName": {
            "type": "string",
            "analyzer": "english"
        },
        "caseHTML": {
            "type": "string",
            "analyzer": "english"
        },
        "caseText": {
            "type": "string",
            "analyzer": "english"
        },
        "description": {
            "type": "string",
            "analyzer": "english"
        },
        "id": {
            "type": "string"
        },
        "shortDescription": {
            "type": "string",
            "analyzer": "english"
        },
        "title": {
            "type": "string",
            "analyzer": "english"
        }
    }
}).then(function(r) {
    debug("Default Mappings - "+constant.caseType,r)
}).error(function(e) {
    debug("Default Mappings - "+constant.caseType,e)
})

elastic.putMapping(constant.userIndex + "_v" + constant.version, constant.userType, {
    "properties": {
        "id": {
            "type": "string",
        },
        "name" : {
            "type":"string",
        },
        "given_name" : {
            "type":"string",
        },
        "family_name" : {
            "type":"string",
        },
        "gender" : {
            "type":"string",
        },
        "picture" : {
            "type":"string",
        },
    }
}).then(function(r) {
    debug("Default Mappings - "+constant.userType,r)
}).error(function(e) {
    debug("Default Mappings - "+constant.userType,e)
})
