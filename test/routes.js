var should = require('should'),
    assert = require('assert'),
    request = require('supertest'),
    winston = require('winston'),
    debug = require('debug')('test'),
    constant = require('../config/constants'),
    sample = require('./sample.js')
config = require('../config');

input = {
    search: "my test",
    detail: "testinput",
    detailBig: "testInputBig",
    login: {
        "user": {
            id: "101130645015448847110",
            name: "moonblade"
        }
    },
    login2: {
        "user": {
            id: "1",
            name: "moonblade"
        }
    },
    editUser: {
        "user": {
            "id": "101130645015448847110",
            "name": "moonblade"
        },
        "editUser": {
            "id": "1",
            "name": "moonblade"
        },
        "newRole": "0"
    },
    putData: {
        "type": "type",
        "commonField": {
            "name": "test Input",
            "value": "test"
        },
        "postData": "[{\"id\": \"testinput\",\"title\":\"my test\"}]",
        "user": {
            "id": "101130645015448847110"
        }
    },
    putDataBig: {
        "type": "type",
        "commonField": {
            "name": "test Input",
            "value": "test"
        },
        "postData": JSON.stringify(sample),
        "user": {
            "id": "101130645015448847110"
        }
    }
}

describe('Routing', function() {
    var url = config.serverUrl;
    var caseUrl = url + "/cases/"
    describe('logged in', function() {
        it('logs in', function(done) {
            request(url)
                .post("/login")
                .send(input.login)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        });

        it('logs in for second user', function(done) {
            request(url)
                .post("/login")
                .send(input.login2)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        });

        it('puts data', function(done) {
            request(caseUrl)
                .put("")
                .send(input.putData)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        })

        it('puts bigger data', function(done) {
            request(caseUrl)
                .put("")
                .send(input.putDataBig)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        })

        it('changes user to normal user', function(done) {
            request(url)
                .post("/edituser")
                .send(input.editUser)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err)
                    done();
                })
        })

    })

    describe('search', function() {
        it('gives back a result on search', function(done) {
            request(caseUrl)
                .get(input.search)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('hits');
                    (res.body.hits.total).should.be.above(0)
                    done();
                })
        })
    });

    describe('detail', function() {
        it('correctly gets details from id', function(done) {
            debug(caseUrl + "display/" + input.detail)
            request(caseUrl)
                .get("display/" + input.detail)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('_id')
                    res.body.should.have.property('_source')
                    done()
                })
        })

        it('correctly gets bigger details from id', function(done) {
            debug(caseUrl + "display/" + input.detail)
            request(caseUrl)
                .get("display/" + input.detailBig)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        return done(err);
                    res.body.should.have.property('_id')
                    res.body.should.have.property('_source')
                    done()
                })
        })
    })
})
