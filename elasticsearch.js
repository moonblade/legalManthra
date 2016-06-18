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
                    type: "string"
                },
                caseHTML: {
                    type: "string"
                },
                caseText: {
                    type: "string"
                },
                description: {
                    type: "string"
                },
                id: {
                    type: "string"
                },
                shortDescription: {
                    type: "string"
                },
                title: {
                    type: "string"
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

function getSuggestions(input) {
    return elasticClient.suggest({
        index: indexName,
        type: caseType,
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;
