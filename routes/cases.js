var express = require('express');
var router = express.Router();
var elastic = require('../elasticsearch');
var indexName = "legal_manthra";
var caseType = "case"

elastic.init("moonblade", "moonblade");
router.get('/:input', function(req, res, next) {
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

/* POST document to be indexed */
router.post('/', function(req, res, next) {
    toReturn = [];
    retFunction = function() {
        res.json(toReturn);
    }
    counter = 0;
    console.log(req.body)
    var type = req.body.type;
    var commonField = req.body.commonField;
    var postData = JSON.parse(req.body.postData)
    elastic.indexExists().then(function(exists) {
        counter = 0;
        postData.forEach(function(tcase) {
            counter++;
            elastic.addCase(type, commonField, tcase).then(function(result) {
                toReturn.push(result);
                if (counter == postData.length) {
                    retFunction();
                }
            });
        });
    });
});

module.exports = router;
