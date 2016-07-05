var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    constant = require('../config/constants'),
    indexName = "legal_manthra",
    caseType = "case",
    debug = require('debug')('cases')
    shortId = require('shortid'),
    auth = require('./auth')
    basicAuth = require('basic-auth')

require('datejs');

elastic.login("moonblade","moonblade");

router.get('/:input', function(req, res, next) {
    elastic.search(req.params.input).then(function(result) {
        debug(result)
        res.json(result)
    });
});

router.get('/display/:id', function(req, res, next) {
    var callback = function(err, result) {
        if (!err) {
            res.json(result)
        }else{
            res.status(500).send({"message":"Some error occurred "+err})
        }
    }
    elastic.getCase(req.params.id, callback)
})

router.put('/', auth.writer, function(req, res, next) {
    debug(res.body)
    var type = req.body.type,
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
                _index: constant.caseIndex,
                _type: constant.caseType,
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
