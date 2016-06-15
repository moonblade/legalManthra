var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "randomindex";

/**
* Delete an existing index
*/
function deleteIndex(indexName) {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex(indexName) {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists(indexName) {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initMapping(indexName) {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "case",
        body: {
            properties: {
                longDescription: {type: "string"},
                dateOfDecision: {type: "string"},
                courtName: {type: "string"},
                caseHTML: {type: "string"},
                caseText:{type: "string"},
                description:{type: "string"},
                id: {type: "string"},
                shortDescription: {type: "string"},
                title: {type: "string"},
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

function addCase(tcase,indexName) {
    return elasticClient.index({
        index: indexName,
        type: "case",
        body: {
            longDescription: tcase.longDescription,
            dateOfDecision: tcase.dateOfDecision,
            courtName: tcase.courtName,
            caseHTML: tcase.caseHTML,
            caseText:tcase.caseText,
            description:tcase.description,
            id: tcase.id,
            shortDescription: tcase.shortDescription,
            title: tcase.title,
            suggest: {
                input: tcase.title.split(" "),
                output: tcase.title,
                payload: { 
                    "courtName" : tcase.courtName,
                    "dateOfDecision" : tcase.dateOfDecision
                }
            }
        }
    });
}
exports.addCase = addCase;

function getSuggestions(input,indexName) {
    return elasticClient.suggest({
        index: indexName,
        type: "case",
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