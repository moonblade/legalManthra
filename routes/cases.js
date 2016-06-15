var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');
var indexName = "case";
/* GET suggestions */
router.get('/suggest/:input', function(req, res, next) {
    elastic.getSuggestions(req.params.input, indexName).then(function(result) {
        res.json(result)
    });
});

/* POST document to be indexed */
router.post('/', function(req, res, next) {
    toReturn = [];
    retFunction = function() {
        res.json(toReturn);
    }
    counter = 0;
    req.body.forEach(function(tcase) {
        counter++;
        elastic.indexExists(indexName).then(function(exists) {
            elastic.addCase(tcase, indexName).then(function(result) {
                toReturn.push(result);
                if (counter == req.body.length) {
                    retFunction();
                }
            });
        });
    });
});

module.exports = router;
