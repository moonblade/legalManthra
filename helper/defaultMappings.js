var express = require('express'),
    elastic = require('../elasticsearch'),
    debug = require('debug')('mapping'),
    constant = require('../config/constants')
startup = false
    // Egde n gram for search as you type
var handle = function(promise, name, disable) {
    if (!disable) {
        promise
            .then(function(r) {
                debug(name, r)
            }).error(function(er) {
                debug(name, er)
            })
    }
}
if (startup) {
    elastic.getClient().indices.close({
            index: constant.user.index,
        })
        .then(function(r) {
            debug("closed", r)
            // elastic.getClient().indices.putSettings({
            //     "index": constant.user.index+"_v"+constant.user.version,
            //     "analysis": {
            //         "filter": {
            //             "autocomplete_filter": {
            //                 "type": "edge_ngram",
            //                 "min_gram": 1,
            //                 "max_gram": 20
            //             }
            //         },
            //         "analyzer": {
            //             "autocomplete": {
            //                 "type": "custom",
            //                 "tokenizer": "standard",
            //                 "filter": [
            //                     "lowercase",
            //                     "autocomplete_filter"
            //                 ]
            //             }
            //         }
            //     }
            // }).then(function(r) {
                debug("analyzer added", r)
                elastic.getClient().indices.open({
                    index: constant.user.index,
                }).then(function(r) {
                    // handle(elastic.deleteAlias(constant.user.index + "_v" + constant.user.version - 1, constant.user.index),"alias delete")
                    // handle(elastic.putAlias(constant.user.index + "_v" + constant.user.version, constant.user.index),"alias create")



                    // Case Mapping
                    handle(elastic.putMapping(constant.case.index, constant.case.type, {
                        "properties": {
                            "type": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "longDescription": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "dateOfDecision": {
                                "type": "date"
                            },
                            "courtName": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "caseHTML": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "caseText": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "description": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "id": {
                                "type": "string"
                            },
                            "shortDescription": {
                                "type": "string",
                                "analyzer": "english"
                            },
                            "title": {
                                "type": "string",
                                "analyzer": "english"
                            }
                        }
                    }), "Default Mappings - " + constant.case.type)

                    // User Mapping
                    handle(elastic.putMapping(constant.user.index, constant.user.type, {
                        "properties": {
                            "id": {
                                "type": "string",
                            },
                            "name": {
                                "type": "string",
                                "analyzer": "autocomplete"
                            },
                            "given_name": {
                                "type": "string",
                            },
                            "family_name": {
                                "type": "string",
                            },
                            "gender": {
                                "type": "string",
                            },
                            "picture": {
                                "type": "string",
                            },
                            "role": {
                                "type": "long"
                            }
                        }
                    }), "Default Mappings - " + constant.user.type)
                })
            }).error(function(er) {
                debug("analyzer", er)
            })
        // }).error(function(er) {
            // debug(er)
        // })
}
