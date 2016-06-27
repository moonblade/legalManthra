var elasticsearch = require('elasticsearch'),
    debug = require('debug')('client'),
    shortId = require('shortid'),
    constant = require('./config/constants'),
    elasticClient;
require('datejs');

exports.initAnon = function initAnon() {
    elasticClient = new elasticsearch.Client();
}

exports.login = function(user, pass) {
    elasticClient = new elasticsearch.Client({
        host: [{
            host: 'localhost',
            auth: user + ':' + pass
        }],
        log: 'info'
    })
}

/**
 * Delete an existing index
 */
exports.deleteIndex = function() {
    return elasticClient.indices.delete({
        index: constant.indexName
    });
}

/**
 * create the index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: constant.indexName
    });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
    return elasticClient.indices.exists({
        index: constant.indexName
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return elasticClient.indices.putMapping({
        index: constant.indexName,
        type: constant.caseType,
        body: {
            properties: {
                type: {
                    type: "string",
                    analyzer: "english"
                },
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

exports.addCaseBulk = function(bulkBody) {
    return elasticClient.bulk({
        body: bulkBody
    });
}

exports.addUser = function addUser(user, callback) {
    user.role = constant.user;
    return elasticClient.indices.create({
        index: constant.userIndex,
        type: constant.userType,
        id: (user.id || shortid.generate()),
        body: user
    }, callback);
}

var getUser = function(user, callback) {
    return elasticClient.get({
        index: constant.userIndex,
        type: constant.userType,
        id: user.id
    }, callback)
}
exports.getUser = getUser

exports.editUser = function(user, newRole, callback) {
    debug(user)
    debug(newRole)
    user.role = newRole
    return elasticClient.update({
        index: constant.userIndex,
        type: constant.userType,
        id: user.id,
        body: {
            doc: user
        }
    }, callback);
}

exports.getCase = function getCase(id, callback) {
    return elasticClient.get({
        index: constant.indexName,
        type: constant.caseType,
        id: id
    }, callback)
}

exports.getSuggestions = function(input, callback) {
    return elasticClient.suggest({
        index: constant.indexName,
        type: constant.caseType,
        body: {
            suggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}

exports.search = function get(input, callback) {
    return elasticClient.search({
        index: constant.indexName,
        type: constant.caseType,
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
                        "type^4"
                    ],
                    "fuzziness": "AUTO",
                    "tie_breaker": 0.3, //to 1 for bool
                }
            }
        }
    }, callback)
}
