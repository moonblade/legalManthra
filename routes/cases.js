var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    constant = require('../config/constants'),
    indexName = "legal_manthra",
    caseType = "case",
    debug = require('debug')('cases')
    shortId = require('shortid'),
    basicAuth = require('basic-auth')

require('datejs');

elastic.login("moonblade","moonblade");

var authenticateadmin = function(req,res,next) {
    unauthorized = function(err)
    {
        return res.status(401).send({"message":"Unauthorized access" + (err?" - "+err:"")});
    }
    if(req.body.user == null)
        unauthorized()
    elastic.getUser(req.body.user, function(err,result){
        if(err)
            unauthorized(err);
        if(result.found && (result._source.role>=constant.admin))
            return next();
        unauthorized();
    })
}

var authenticate = function(req,res,next) {
    unauthorized = function(err)
    {
        return res.status(401).send({"message":"Unauthorized access" + (err?" - "+err:"")});
    }
    if(req.body.user == null)
        unauthorized()
    elastic.getUser(req.body.user, function(err,result){
        if(err)
            unauthorized(err);
        if(result.found && (result._source.role>=constant.writer))
            return next();
        unauthorized();
    })
}

router.get('/:input', function(req, res, next) {
    elastic.search(req.params.input).then(function(result) {
        debug(result)
        res.json(result)
    });
});

router.get('/getsuggestions/:input', function(req, res, next) {
    var callback = function(err, result) {
        if (!err) {
            res.json(result);
        }
    }
    elastic.getSuggestions(req.params.input, callback)
})

router.get('/display/:id', function(req, res, next) {
    var callback = function(err, result) {
        if (!err) {
            res.json(result)
        }
    }
    elastic.getCase(req.params.id, callback)
})

router.put('/', authenticate, function(req, res, next) {
    var index = "legal_manthra",
        elasticType = "case",
        type = req.body.type,
        commonField = req.body.commonField,
        postData = JSON.parse(req.body.postData),
        bulkBody = []
    postData.forEach(function(element) {
        if (!element.id)
            element.id = shortId.generate();
        if (element.dateOfDecision)
            element.dateOfDecision = Date.parse(element.dateOfDecision)
        element[commonField.name] = commonField.value;
        bulkBody.push({
            index: {
                _index: index,
                _type: elasticType,
                _id: element.id
            }
        })
        bulkBody.push(element)
    });
    elastic.addCaseBulk(bulkBody)
        .then(function(result) {
            debug(result);
            res.json(result)
        }).error(function(error) {
            debug(error);
            res.status(error.status).send(error);
        })
})

module.exports = router;
