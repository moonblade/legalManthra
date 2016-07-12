var config = require('./index')
var indexName = "legal_manthra"
var constant = {
    role: {
        user: 0,
        writer: 1,
        admin: 2,
    },
    indexName: indexName,
    case: {
        index: indexName,
        type: "case",
        version: 1,
    },
    user: {
        index: indexName,
        type: "user",
        version: 2,
    }
}
module.exports = constant;
