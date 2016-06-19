var elasticsearch = require('elasticsearch');
require('datejs');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});
var indexName = "legal_manthra";
var caseType = "case";

/**
 * Delete an existing index
 */
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: caseType,
        body: {
            properties: {
                longDescription: {
                    type: "string",
                    analyzer: "english"
                },
                dateOfDecision: {
                    type: "date"
                },
                courtName: {
                    type: "string",
                    analyzer: "english"
                },
                caseHTML: {
                    type: "string",
                    analyzer: "english"
                },
                caseText: {
                    type: "string",
                    analyzer: "english"
                },
                description: {
                    type: "string",
                    analyzer: "english"
                },
                id: {
                    type: "string"
                },
                shortDescription: {
                    type: "string",
                    analyzer: "english"
                },
                title: {
                    type: "string",
                    analyzer: "english"
                },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addCase(tcase) {
    tcase.dateOfDecision = Date.parse(tcase.dateOfDecision)
    return elasticClient.index({
        index: indexName,
        type: caseType,
        id: tcase.id,
        body: {
            longDescription: tcase.longDescription,
            dateOfDecision: tcase.dateOfDecision,
            courtName: tcase.courtName,
            caseHTML: tcase.caseHTML,
            caseText: tcase.caseText,
            description: tcase.description,
            id: tcase.id,
            shortDescription: tcase.shortDescription,
            title: tcase.title,
            suggest: {
                input: tcase.title.split(" "),
                output: tcase.title,
                payload: {
                    "courtName": tcase.courtName,
                    "dateOfDecision": tcase.dateOfDecision,
                    "id": tcase.id
                }
            }
        }
    });
}
exports.addCase = addCase;

exports.getCase = function getCase(id, callback) {
    return elasticClient.search({
        index: indexName,
        type: caseType,
        id: id
    }, callback)
}

exports.search = function get(input, callback) {
    return elasticClient.search({
        index: indexName,
        type: caseType,
        analyzer: "english",
        analyzeWildCard: "true",
        body: {
            query: {
                multi_match: {
                    "query": input,
                    "type": "best_fields", //or most_fields for bool
                    "fields": ["longDescription^5",
                        "description",
                        "shortDescription",
                        "caseHTML^5",
                        "caseText^5",
                        "*_title^10",
                        "courtName",
                    ],
                    "fuzziness":"AUTO",
                    "tie_breaker": 0.4, //to 1 for bool
                }
            }
        }
    }, callback)
}
