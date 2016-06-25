var express = require('express'),
    router = express.Router(),
    elastic = require('../elasticsearch'),
    indexName = "legal_manthra",
    caseType = "case",
    shortId = require('shortid'),
    passport = require('passport'),
    cors = require('cors')
require('datejs');

elastic.initAnon();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({"message":"Unauthorized Access"});
}

router.get('/:input',ensureAuthenticated, function(req, res, next) {
    elastic.search(req.params.input).then(function(result) {
        console.log(result)
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

router.put('/',ensureAuthenticated, function(req, res, next) {
    var index = "case",
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
            console.log(result);
            res.json(result)
        }).error(function(error) {
            console.log(error);
            res.status(error.status).send(error);
        })
})

module.exports = router;
