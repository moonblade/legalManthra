var config = require('./index')
var constant = {
    user: 0,
    writer: 1,
    admin: 2,
    indexName: "legal_manthra",
    caseIndex: config.caseIndex,
    caseType: "case",
    userIndex: config.userIndex,
    userType: "user",
}
module.exports = constant;
