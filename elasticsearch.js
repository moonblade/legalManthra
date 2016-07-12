var elasticsearch = require('elasticsearch'),
    debug = require('debug')('client'),
    shortId = require('shortid'),
    constant = require('./config/constants'),
    elasticClient;
require('datejs');

exports.getClient = function() {
    return elasticClient;
}

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

exports.deleteIndex = function(indexName) {
    return elasticClient.indices.delete({
        index: indexName
    });
}

exports.initIndex = function(indexName) {
    return elasticClient.indices.create({
        index: indexName
    });
}

exports.indexExists = function(indexName) {
    return elasticClient.indices.exists({
        index: indexName
    });
}

exports.reindex = function(oldIndex, newIndex) {
    return elasticClient.reindex({
        source: {
            index: oldIndex
        },
        dest: {
            index: newIndex
        }
    })
}

exports.getAlias = function(index, alias) {
    debug(index, alias)
    return elasticClient.indices.getAlias({
        index: index,
        name: alias
    })
}

exports.putAlias = function(index, alias) {
    debug(index, alias)
    return elasticClient.indices.putAlias({
        index: index,
        name: alias
    })
}

exports.deleteAlias = function(index, alias) {
    return elasticClient.indices.deleteAlias({
        index: index,
        name: alias
    })
}

exports.putMapping = function(indexName, type, mapping) {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: type,
        body: mapping
    });
}

exports.addCaseBulk = function(bulkBody) {
    return elasticClient.bulk({
        body: bulkBody
    });
}

exports.addUser = function addUser(user) {
    user.role = constant.role.user;
    debug(user)
    debug(user.id)
    return elasticClient.create({
        index: constant.user.index,
        type: constant.user.type,
        id: (user.id || shortId.generate()),
        body: user
    });
}

exports.getUser = function(user, callback) {
    return elasticClient.get({
        index: constant.user.index,
        type: constant.user.type,
        id: user.id
    }, callback)
}

exports.searchUsers = function(body, callback) {
    return elasticClient.search({
        index: constant.user.index,
        type: constant.user.type,
        body: {
            body
        }
    })
}
exports.editUser = function(user, newRole) {
    debug(user)
    debug(newRole)
    user.role = newRole
    return elasticClient.update({
        index: constant.user.index,
        type: constant.user.type,
        id: user.id,
        body: {
            doc: user
        }
    });
}

exports.getCase = function getCase(id, callback) {
    return elasticClient.get({
        index: constant.case.index,
        type: constant.case.type,
        id: id
    }, callback)
}

exports.search = function get(input, callback) {
    return elasticClient.search({
        index: constant.case.index,
        type: constant.case.type,
        analyzer: "english",
        analyzeWildCard: "true",
        body: {
            query: {
                multi_match: {
                    "query": input,
                    "type": "cross_fields", //or most_fields for bool
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
